<script lang="ts">
  import { supabase } from '../supabaseClient'
  import { title } from '../stores/title.js'
  import { link } from 'svelte-routing'

  title.set('Login')

  let loadingSignIn: boolean = false
  let signInEmail: string = ''
  let signInPassword: string = ''
  let errorMessage: string = ''

  export let skipLogin

  const handleSignInWithPassword = async () => {
    try {
      loadingSignIn = true
      errorMessage = ''

      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      })

      if (error) throw error
    } catch (error) {
      console.error(error)
      errorMessage = error.message
    } finally {
      loadingSignIn = false
    }
  }

  const handleSignInWithOAuth = async () => {
    try {
      loadingSignIn = true
      errorMessage = ''

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      })

      if (error) throw error
    } catch (error) {
      console.error(error)
    } finally {
      loadingSignIn = false
    }
  }
</script>

<div class="row flex-center flex">
  <div class="col-6 form-widget" aria-live="polite">
    <h1 class="header">Hacktoberfest Tracker</h1>
    {#if import.meta.env.VITE_DEV_SERVER === 'Y'}
      <button on:click={skipLogin}>Skip Login</button>
    {/if}
    <p class="description">Sign in using your GitHub account</p>
    <div>
      <button
        type="button"
        class="button social-button"
        aria-live="polite"
        disabled={loadingSignIn}
        on:click={handleSignInWithOAuth}
      >
        <span>
          <img src="/github.svg" alt="GitHub Icon" />
        </span>
        <span>{loadingSignIn ? 'Loading' : 'Sign In with GitHub'}</span>
      </button>
    </div>
    <div role="separator" class="divider">
      <span class="">or</span>
    </div>
    <p class="description">Sign in using your email and password below</p>
    <form
      class="form-widget"
      on:submit|preventDefault={handleSignInWithPassword}
    >
      <div>
        <label for="email">Email</label>
        <input
          id="email"
          class="inputField"
          type="email"
          placeholder="Your email"
          bind:value={signInEmail}
        />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          id="password"
          class="inputField"
          type="password"
          placeholder="Your password"
          bind:value={signInPassword}
        />
      </div>
      <div>
        <button
          type="submit"
          class="button block"
          aria-live="polite"
          disabled={loadingSignIn}
        >
          <span>{loadingSignIn ? 'Loading' : 'Submit Sign In'}</span>
        </button>
        {#if errorMessage}
          <p style="color: red;">{errorMessage}</p>
        {/if}
      </div>
    </form>

    <p class="description">
      Don't have an account? Sign up <a href="/signup" use:link>here</a>.
    </p>
  </div>
</div>

<style>
  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 1rem;
  }

  .divider {
    color: rgb(187, 187, 187);
    margin: 1rem 0;
    width: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-size: 0.9rem;
  }

  .divider::before {
    border-bottom-style: solid;
    border-bottom-width: 1px;
    content: '';
    position: relative;
    display: inline-block;
    width: 50%;
  }

  .divider span {
    margin: 1rem;
  }

  .divider::after {
    border-bottom-style: solid;
    border-bottom-width: 1px;
    content: '';
    position: relative;
    display: inline-block;
    width: 50%;
  }
</style>
