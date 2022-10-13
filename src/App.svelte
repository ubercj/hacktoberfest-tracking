<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from './supabaseClient'
  import type { AuthSession } from '@supabase/supabase-js'
  import Account from './lib/Account.svelte'
  import Auth from './lib/Auth.svelte'
  import Dashboard from './lib/Dashboard.svelte'
  import { title } from "./data/title.js";

  title.clear()
  let session: AuthSession

  onMount(() => {
    supabase.auth.getSession().then(({ data }) => {
      session = data.session
    })

    supabase.auth.onAuthStateChange((_event, _session) => {
      session = _session
    })
  })
</script>

<svelte:head>
	<title>{$title}</title>
</svelte:head>

<main class="container" style="padding: 50px 0 100px 0">
  {#if !session}
    <Auth />
  {:else}
    <Account {session} />
    <Dashboard />
  {/if}
</main>
