<script lang="ts">
  import { link } from 'svelte-routing'
  import { onMount } from 'svelte'
  import { supabase } from '../supabaseClient'
  import type { AuthSession } from '@supabase/supabase-js'
  import { title } from '../stores/title.js'

  title.set('Groups')
  let allGroups = []
  export let session: AuthSession
  const { user } = session

  onMount(() => {
    getAllGroups()
  })

  const getAllGroups = async () => {
    const { data: groupsData, error: groupsError } = await supabase
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
