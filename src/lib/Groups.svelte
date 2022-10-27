<script lang="ts">
  import { link } from 'svelte-routing'
  import { onMount } from 'svelte'
  import { supabase } from '../supabaseClient'
  import { title } from '../stores/title.js'
  import { currentUser } from '../stores/user'
  import type { User, Group } from '../utils/types'
  import { getGroups } from '../utils/queries'

  title.set('Groups')

  let user: User
  currentUser.subscribe((u: User) => {
    user = u
  })

  let allGroups: Group[] = []
  let userGroups: Group[] = []

  onMount(() => {
    getGroupsData()
  })

  const getGroupsData = async () => {
    try {
      const { data: groupData, error: groupError } = await getGroups(user.id)
      if (groupData) {
        userGroups = groupData
      }
      if (groupError) {
        throw new Error(`There was an error retrieving group data`)
      }

      await getUnjoinedGroups()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  const getUnjoinedGroups = async () => {
    const { data: groupsData, error: groupsError } = await supabase
      .from('groups')
      .select(
        `
          id,
          name
        `
      )
      .not('id', 'in', `(${userGroups.map((group) => group.id)})`)

    if (groupsData) {
      allGroups = groupsData
    }
  }

  const handleClick = (event) => {
    joinGroup(parseInt(event.target.dataset.groupId))
  }

  const joinGroup = async (groupId: number) => {
    try {
      let { error, status } = await supabase
        .from('group_profile')
        .insert({ group_id: groupId, profile_id: user.id })

      if (status === 201) {
        alert('You have successfully joined the group.')

        // Re-render list of groups to remove group just joined
        getGroupsData()
      }

      if (error) throw error
    } catch (error) {
      console.log(error)
      alert('There was an error joining this group.')
    }
  }
</script>

<section class="groups">
  <h1>Groups</h1>

  {#if !allGroups.length}
    <p>There are no groups to show.</p>
  {/if}

  <dl class="groups-list">
    {#each allGroups as group}
      <dd class="group-name">
        {group.name}<button data-group-id={group.id} on:click={handleClick}
          >Join</button
        >
      </dd>
    {/each}
  </dl>

  <a href="/" use:link>Back to Dashboard</a>
</section>

<style>
  .groups {
    width: 50%;
    margin: 0 auto;
  }

  dd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
</style>
