<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '../supabaseClient'
  import { title } from '../stores/title.js'
  import { link } from 'svelte-routing'

  title.set('Dashboard')
  import type { AuthSession } from '@supabase/supabase-js'

  export let session: AuthSession
  const { user } = session

  let loading = false
  let userGroups = []
  let selectedGroup
  let profiles = []

  onMount(() => {
    getDashboardData()
  })

  const getDashboardData = async () => {
    await getGroups()
    await getGroupProfiles()
  }

  const getGroups = async () => {
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .select(
        `
          id,
          name,
          group_profile (
            id
          )
        `
      )
      .eq('group_profile.profile_id', user.id)

    if (groupData) {
      userGroups = groupData
      selectedGroup = groupData[0]
    }
  }

  const getGroupProfiles = async () => {
    try {
      loading = true

      const { data: groupProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select(
          `
          id,
          username,
           website,
           avatar_url,
           shirt_size,
           pull_requests,
           group_profile!inner (
            id,
            group_id
            )
          `
        )
        .eq('group_profile.group_id', selectedGroup.id)

      if (groupProfiles) {
        profiles = groupProfiles
      }
    } catch (error) {
      console.error('Error fetching Groups from database: ', error)
      alert(`There was an error retrieving data for ${selectedGroup.name}`)
    } finally {
      loading = false
    }
  }

  const handleGroupChange = (event) => {
    selectedGroup = userGroups.find(
      (group) => group.id === parseInt(event.target.value)
    )
  }
</script>

<section class="dashboard">
  <header>
    <h1>{selectedGroup ? selectedGroup.name : 'Your'} Dashboard</h1>
    <select name="groupSelect" id="groupSelect" on:change={handleGroupChange}>
      {#each userGroups as group}
        <option value={group.id}>{group.name}</option>
      {/each}
    </select>
  </header>

  {#if !userGroups.length}
    <p>
      You are not a member of any groups. <a href="/groups" use:link
        >Join a group.</a
      >
    </p>
  {/if}

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
    justify-content: space-evenly;
    align-items: center;
  }

  select {
    background: black;
    color: white;
    padding: 0.5rem;
  }
</style>
