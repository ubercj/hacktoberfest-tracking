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
      <select name="groupSelect" id="groupSelect" on:change={handleGroupChange}>
        {#each userGroups as group}
          <option value={group.id}>{group.name}</option>
        {/each}
      </select>
    {:else}
      <p>
        You are not a member of any groups. <a href="/groups" use:link
          >Join a group.</a
        >
      </p>
    {/if}
  </header>

  <dl class="profiles">
    {#each profiles as profile}
      <dt class="profile-username">{profile.username}</dt>
      <dd class="profile-description">
        <p>Pull requests completed: {profile.pull_requests}</p>
        <p>Shirt size: {profile.shirt_size}</p>
      </dd>
    {/each}
  </dl>

  <p><a href="/groups" use:link>See all groups.</a></p>
</section>

<style>
  header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
  }

  select {
    background: black;
    color: white;
    padding: 0.5rem;
  }
</style>
