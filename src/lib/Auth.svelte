<script lang="ts">
  import { supabase } from '../supabaseClient'

  let loadingSignIn: boolean = false
  let loadingSignUp: boolean = false
  let signInEmail: string = ''
  let signInPassword: string = ''
  let signUpEmail: string = ''
  let signUpPassword: string = ''

  const handleSignIn = async () => {
    try {
      loadingSignIn = true

      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      })

      if (error) throw error
      console.log(`Logged in user: ${JSON.stringify(data, undefined, 2)}`)
    } catch (error) {
      console.error(error)
    } finally {
      loadingSignIn = false
    }
  }

  const handleSignUp = async () => {
    try {
      loadingSignUp = true

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
      loadingSignUp = false
    }
  }
</script>

<div class="row flex-center flex">
  <div class="col-6 form-widget" aria-live="polite">
    <h1 class="header">Hacktoberfest Tracker</h1>
    <p class="description">Sign in using your email and password below</p>
    <form class="form-widget" on:submit|preventDefault={handleSignIn}>
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
      </div>
    </form>

    <p class="description">Don't have an account? Sign up here.</p>
    <form class="form-widget" on:submit|preventDefault={handleSignUp}>
      <div>
        <label for="email">Signup Email</label>
        <input
          id="email"
          class="inputField"
          type="email"
          placeholder="Your email"
          bind:value={signUpEmail}
        />
      </div>
      <div>
        <label for="password">Create a Password</label>
        <input
          id="password"
          class="inputField"
          type="password"
          placeholder="Your password"
          bind:value={signUpPassword}
        />
      </div>
      <div>
        <button
          type="submit"
          class="button block"
          aria-live="polite"
          disabled={loadingSignIn}
        >
          <span>{loadingSignUp ? 'Loading' : 'Complete Signup'}</span>
        </button>
      </div>
    </form>
  </div>
</div>
