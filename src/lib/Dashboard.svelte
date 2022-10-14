<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '../supabaseClient'
  import { title } from "../stores/title.js";

	title.set('Dashboard');

  let loading = false
  let profiles = []

  onMount(() => {
    getProfile()
  })

  const getProfile = async () => {
    try {
      loading = true

      const { data, error, status } = await supabase
        .from('profiles')
        .select('username, website, avatar_url, shirt_size, pull_requests')

      if (error && status !== 406) throw error

      if (data) {
        profiles = data
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

<section class="dashboard">
  <h1>Dashboard</h1>

  <dl class="profiles">
    {#each profiles as profile}
      <dt class="profile-username">{profile.username}</dt>
      <dd class="profile-description">
        <p>Pull requests completed: {profile.pull_requests}</p>
        <p>Shirt size: {profile.shirt_size}</p>
      </dd>
    {/each}
  </dl>
</section>
