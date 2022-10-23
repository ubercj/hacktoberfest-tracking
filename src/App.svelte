<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from './supabaseClient'
  import type { AuthSession } from '@supabase/supabase-js'
  import Account from './lib/Account.svelte'
  import Auth from './lib/Auth.svelte'
  import Dashboard from './lib/Dashboard.svelte'
  import { title } from './stores/title.js'
  import { currentUser } from './stores/user.js'
  import { Router, Route } from 'svelte-routing'
  import Signup from './lib/Signup.svelte'
  import Groups from './lib/Groups.svelte'
  import { mockUser } from './mocks/mockData'

  // For dev environment
  if (import.meta.env.VITE_DEV_SERVER === 'Y') {
    const loadWorker = async () => {
      const { worker } = await import('./mocks/browser')
      worker.start()
    }
    loadWorker()
  }
  const skipLogin = async () => {
    session = {
      access_token: 'dev-token',
      token_type: 'bearer',
      expires_in: 10000,
      refresh_token: 'dev-refresh',
      user: {
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: 'now',
        ...mockUser,
      },
    }
    currentUser.set(mockUser)
  }

  title.clear()
  let session: AuthSession

  onMount(() => {
    handleAuthState()
  })

  const handleAuthState = async () => {
    const sessResp = await supabase.auth.getSession()
    session = sessResp.data.session
    currentUser.set(session?.user)

    supabase.auth.onAuthStateChange((_event, _session) => {
      session = _session
      currentUser.set(session.user)
    })
  }

  export let url = ''
</script>

<svelte:head>
  <title>{$title}</title>
</svelte:head>

<Router {url}>
  <main class="container" style="padding: 50px 0 100px 0">
    {#if !session}
      <Route path="/"><Auth {skipLogin} /></Route>
      <Route path="/signup"><Signup /></Route>
    {:else}
      <Route path="/">
        <Account />
        <Dashboard />
      </Route>
      <Route path="/groups"><Groups /></Route>
    {/if}
  </main>
</Router>
