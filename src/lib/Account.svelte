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
    <Avatar bind:url={currentProfile.avatar_url} on:upload={updateProfile} />
    <sl-input
      id="email"
      label="Email"
      type="text"
      value={user.email}
      disabled
    />
    <sl-input
      id="username"
      label="Name"
      type="text"
      value={currentProfile.username}
      on:sl-input={(e) => (currentProfile.username = e.target.value)}
    />
    <sl-select
      label="Shirt Size"
      value={currentProfile.shirt_size}
      placeholder="Select a Size"
      clearable
      on:sl-change={(e) => (currentProfile.shirt_size = e.target.value)}
    >
      {#each allShirtSizes as singleShirtSize}
        <sl-menu-item value={singleShirtSize}>
          {singleShirtSize}
        </sl-menu-item>
      {/each}
    </sl-select>
    <sl-input
      id="pullRequests"
      label="Pull Requests"
      type="number"
      value={currentProfile.pull_requests}
      on:sl-input={(e) => (currentProfile.pull_requests = e.target.value)}
    />
    <sl-input
      id="website"
      label="Website"
      type="text"
      value={currentProfile.website}
      on:sl-input={(e) => (currentProfile.website = e.target.value)}
    />
    <sl-button type="submit" class="update" aria-live="polite" {loading}>
      <span>Update Profile</span>
    </sl-button>
    <sl-button
      type="button"
      variant="warning"
      aria-live="polite"
      on:click={() => supabase.auth.signOut()}
    >
      <span>Sign Out</span>
    </sl-button>
  </form>
</section>

<style>
  .user-account {
    flex: 1;
    padding: 2rem;
  }

  .form-widget {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 640px;
    margin: auto;
  }

  sl-input::part(form-control-label) {
    margin-bottom: 0.5rem;
  }
</style>
