<script lang="ts">
  import { onMount } from 'svelte'
  import type { AuthSession } from '@supabase/supabase-js'
  import { supabase } from '../supabaseClient'
  import Avatar from './Avatar.svelte'
  import { title } from "../stores/title.js";

  title.set('Account');

  export let session: AuthSession

  let loading = false
  let username: string | null = null
  let shirtSize: string = ''
  let allShirtSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  let pullRequests: number | null = 0
  let website: string | null = null
  let avatarUrl: string | null = null

  onMount(() => {
    getProfile()
  })

  const getProfile = async () => {
    try {
      loading = true
      const { user } = session

      const { data, error, status } = await supabase
        .from('profiles')
        .select('username, website, avatar_url, shirt_size, pull_requests')
        .eq('id', user.id)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        username = data.username
        website = data.website
        avatarUrl = data.avatar_url
        shirtSize = data.shirt_size
        pullRequests = data.pull_requests
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading = false
    }
  }

  const updateProfile = async () => {
    try {
      loading = true
      const { user } = session

      const updates = {
        id: user.id,
        username,
        shirt_size: shirtSize,
        pull_requests: pullRequests,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading = false
    }
  }
</script>

<section class="user-account">
  <h2>Your Profile</h2>
  <form on:submit|preventDefault={updateProfile} class="form-widget">
    <Avatar bind:url={avatarUrl} size={150} on:upload={updateProfile} />
    <div>Email: {session.user.email}</div>
    <div>
      <label for="username">Name</label>
      <input id="username" type="text" bind:value={username} />
    </div>
    <div>
      <label for="shirtSize">Shirt Size</label>
      <select class="shirt-size-select" bind:value={shirtSize} >
        <option value='' selected disabled hidden>Select a Size</option>
        {#each allShirtSizes as singleShirtSize}
          <option value={singleShirtSize}>
            {singleShirtSize}
          </option>
        {/each}
      </select>
    </div>
    <div>
      <label for="pullRequests">Pull Requests</label>
      <input id="pullRequests" type="number" bind:value={pullRequests} />
    </div>
    <div>
      <label for="website">Website</label>
      <input id="website" type="text" bind:value={website} />
    </div>
    <div>
      <button type="submit" class="button primary block" disabled={loading}>
        {loading ? 'Saving ...' : 'Update profile'}
      </button>
    </div>
    <button
      type="button"
      class="button block"
      on:click={() => supabase.auth.signOut()}
    >
      Sign Out
    </button>
  </form>
</section>

<style>
  .shirt-size-select {
    width: 100%;
    border-radius: 5px;
    border: var(--custom-border);
    padding: 8px;
    font-size: 0.9rem;
    background-color: var(--custom-bg-color);
    color: var(--custom-color);
  }
</style>
