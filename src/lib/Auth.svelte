<script lang="ts">
  import { supabase } from '../supabaseClient'
  import { title } from '../stores/title.js'
  import { link } from 'svelte-routing'

  title.set('Login')

  let loading: boolean
  let signInEmail: string = ''
  let signInPassword: string = ''

  export let skipLogin

  const handleSignInWithPassword = async () => {
    try {
      loading = true

      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      })

      if (error) throw error
    } catch (error) {
      console.error(error)
    } finally {
      loading = false
    }
  }

  const handleSignInWithOAuth = async () => {
    try {
      loading = true

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: import.meta.env.VITE_REDIRECT_URL,
        },
      })

      if (error) throw error
    } catch (error) {
      console.error(error)
    } finally {
      loading = false
    }
  }
</script>

<section class="login">
  <div class="form-widget" aria-live="polite">
    <h1 class="header">Hacktoberfest Tracker</h1>
    {#if import.meta.env.VITE_DEV_SERVER === 'Y'}
      <sl-button variant="warning" on:click={skipLogin}>Skip Login</sl-button>
    {/if}
    <sl-button
      type="button"
      class="social-button"
      aria-live="polite"
      {loading}
      on:click={handleSignInWithOAuth}
    >
      <img slot="prefix" src="/github.svg" alt="GitHub Icon" />
      <span>Sign In with GitHub</span>
    </sl-button>
    <div role="separator" class="divider">
      <sl-divider /><span>or</span><sl-divider />
    </div>
    <p class="description">Sign in using your email and password below</p>
    <form
      class="form-widget"
      on:submit|preventDefault={handleSignInWithPassword}
    >
      <sl-input
        id="email"
        label="Email"
        type="email"
        placeholder="Your email"
        value={signInEmail}
        on:sl-input={(e) => (signInEmail = e.target.value)}
      />
      <sl-input
        id="password"
        label="Password"
        type="password"
        placeholder="Your password"
        value={signInPassword}
        on:sl-input={(e) => (signInPassword = e.target.value)}
      />
      <sl-button type="submit" class="sign-in" aria-live="polite" {loading}>
        <span>Submit Sign In</span>
      </sl-button>
    </form>

    <p class="description">
      Don't have an account? Sign up <a href="/signup" use:link>here</a>.
    </p>
  </div>
</section>

<style>
  .login {
    width: 100%;
  }

  .description {
    font-size: 1.1rem;
  }

  .form-widget {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 640px;
    margin: auto;
  }
  .social-button::part(base) {
    display: flex;
    align-items: center;
  }

  .social-button::part(base):hover {
    background-color: initial;
  }

  sl-input {
    width: 100%;
  }

  sl-input::part(form-control) {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }

  sl-input::part(form-control-label) {
    display: flex;
    align-items: center;
    flex: 1 0 20%;
  }

  sl-input::part(form-control-input) {
    flex: 1 0 80%;
  }

  .divider {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 1rem;
  }

  sl-divider {
    flex: 1;
    --width: 2px;
  }
</style>
