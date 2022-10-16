<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from './supabaseClient'
  import type { AuthSession } from '@supabase/supabase-js'
  import Account from './lib/Account.svelte'
  import Auth from './lib/Auth.svelte'
  import Dashboard from './lib/Dashboard.svelte'
  import { title } from './stores/title.js'
  import { Router, Route } from 'svelte-routing'
  import Signup from './lib/Signup.svelte'

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

  export let url = ''
</script>

<svelte:head>
  <title>{$title}</title>
</svelte:head>

<Router {url}>
  <main class="container" style="padding: 50px 0 100px 0">
    {#if !session}
      <Route path="/"><Auth /></Route>
      <Route path="/signup"><Signup /></Route>
    {:else}
      <Route path="/">
        <Account {session} />
        <Dashboard {session} />
      </Route>
    {/if}
  </main>
</Router>
