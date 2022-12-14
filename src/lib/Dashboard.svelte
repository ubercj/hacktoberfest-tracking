<script lang="ts">
  import { onMount } from 'svelte'
  import { title } from '../stores/title.js'
  import { link } from 'svelte-routing'
  import { currentUser } from '../stores/user'
  import { getGroups, getProfilesForGroup } from '../utils/queries'
  import type { User, Group, Profile } from '../utils/types'

  title.set('Dashboard')

  let user: User
  currentUser.subscribe((u: User) => {
    user = u
  })

  let loading = false
  let userGroups: Group[] = []
  let selectedGroup: Group
  let profiles: Profile[] = []

  onMount(() => {
    getDashboardData()
  })

  const getDashboardData = async () => {
    loading = true
    try {
      const { data: groupData, error: groupError } = await getGroups(user.id)
      if (groupData) {
        userGroups = groupData
        if (!selectedGroup) selectedGroup = groupData[0]
      }
      if (groupError) {
        throw new Error(`There was an error retrieving group data`)
      }

      const { data: groupProfiles, error: profilesError } =
        await getProfilesForGroup(selectedGroup.id)
      if (groupProfiles) {
        profiles = groupProfiles
      }
      if (profilesError) {
        throw new Error(
          `There was an error retrieving profiles for ${selectedGroup.name}`
        )
      }
    } catch (error) {
      console.error(error)
      alert(error.message)
    } finally {
      loading = false
    }
  }

  const handleGroupChange = (event) => {
    let currGroup = selectedGroup
    selectedGroup = userGroups.find(
      (group) => group.id === parseInt(event.target.value)
    )

    // Re-render list of profiles when group changes
    if (selectedGroup.id !== currGroup.id) {
      getDashboardData()
    }
  }
</script>

<section class="dashboard">
  <header>
    <h1>{selectedGroup ? selectedGroup.name : 'Your'} Dashboard</h1>
    {#if userGroups.length}
      <sl-select
        value={selectedGroup.id}
        placeholder="Select a Group"
        on:sl-change={(e) => handleGroupChange(e)}
      >
        {#each userGroups as group}
          <sl-menu-item value={group.id}>{group.name}</sl-menu-item>
        {/each}
      </sl-select>
    {:else}
      <p>
        You are not a member of any groups. <a href="/groups" use:link
          >Join a group.</a
        >
      </p>
    {/if}
  </header>

  <ul class="profiles">
    {#each profiles as profile}
      <li>
        <sl-card>
          <div slot="header"><h3>{profile.username}</h3></div>
          <p>Pull requests completed: {profile.pull_requests}</p>
          <p>Shirt size: {profile.shirt_size}</p>
        </sl-card>
      </li>
    {/each}
  </ul>

  <p><a href="/groups" use:link>See all groups.</a></p>
</section>

<style>
  header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
  }

  li {
    list-style: none;
  }

  sl-card {
    width: 100%;
    margin-bottom: 1rem;
  }
</style>
