<script lang="ts">
  import { supabase } from '../supabaseClient'
  import { title } from '../stores/title.js'
  import { link } from 'svelte-routing'

  title.set('Sign Up')

  let loading: boolean = false
  let signUpEmail: string = ''
  let signUpPassword: string = ''

  const handleSignUp = async () => {
    try {
      loading = true

      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          emailRedirectTo: import.meta.env.VITE_REDIRECT_EMAIL,
        },
      })

      if (error) throw error

      console.log(`Signed up user: ${JSON.stringify(data, undefined, 2)}`)
      alert(
        `Almost there! Please confirm your email address by following the link that has been sent to ${data.user.email}.`
      )
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
    <p class="description">Enter your desired credentials to sign up</p>
    <form class="form-widget" on:submit|preventDefault={handleSignUp}>
      <sl-input
        id="email"
        label="Email"
        type="email"
        placeholder="Your email"
        on:sl-input={(e) => (signUpEmail = e.target.value)}
      />
      <sl-input
        id="password"
        label="Password"
        type="password"
        placeholder="Your password"
        on:sl-input={(e) => (signUpPassword = e.target.value)}
      />
      <sl-button
        type="submit"
        class="sign-up"
        aria-live="polite"
        disabled={loading}
      >
        <span>{loading ? 'Loading' : 'Submit Sign In'}</span>
      </sl-button>
      <p class="description">
        <a href="/" use:link>Back to Login</a>
      </p>
    </form>
  </div>
</section>

<style>
  .login {
    width: 100%;
  }

  .form-widget {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 640px;
    margin: auto;
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
</style>
