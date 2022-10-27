<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '../supabaseClient'
  import Avatar from './Avatar.svelte'
  import { title } from '../stores/title.js'
  import { currentUser } from '../stores/user'
  import type { User, Profile } from '../utils/types'
  import { getUserProfile, updateUserProfile } from '../utils/queries'

  title.set('Account')

  let user: User
  currentUser.subscribe((u: User) => {
    user = u
  })

  let currentProfile: Profile = {
    username: null,
    shirt_size: null,
    pull_requests: null,
    website: null,
    avatar_url: null,
  }

  let loading = false
  let allShirtSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

  onMount(() => {
    getProfile()
  })

  const getProfile = async () => {
    try {
      loading = true
      const { data, error, status } = await getUserProfile(user.id)

      if (error && status !== 406) throw error

      if (data) {
        currentProfile = {
          username: data.username,
          shirt_size: data.shirt_size,
          pull_requests: data.pull_requests,
          website: data.website,
          avatar_url: data.avatar_url,
        }
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

      let { error } = await updateUserProfile(user.id, currentProfile)
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
    <Avatar
      bind:url={currentProfile.avatar_url}
      size={150}
      on:upload={updateProfile}
    />
    <div>Email: {user.email}</div>
    <div>
      <label for="username">Name</label>
      <input id="username" type="text" bind:value={currentProfile.username} />
    </div>
    <div>
      <label for="shirtSize">Shirt Size</label>
      <select class="shirt-size-select" bind:value={currentProfile.shirt_size}>
        <option value="" selected disabled hidden>Select a Size</option>
        {#each allShirtSizes as singleShirtSize}
          <option value={singleShirtSize}>
            {singleShirtSize}
          </option>
        {/each}
      </select>
    </div>
    <div>
      <label for="pullRequests">Pull Requests</label>
      <input
        id="pullRequests"
        type="number"
        bind:value={currentProfile.pull_requests}
      />
    </div>
    <div>
      <label for="website">Website</label>
      <input id="website" type="text" bind:value={currentProfile.website} />
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
