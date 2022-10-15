<script lang="ts">
    import { supabase } from '../supabaseClient'
    import { title } from "../stores/title.js";
    import { link } from "svelte-routing";
  
      title.set('Sign Up');
  
    let loadingSignUp: boolean = false
    let signUpEmail: string = ''
    let signUpPassword: string = ''
  
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
      <p class="description">Enter your desired credentials to sign up</p>
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
          >
            <span>{loadingSignUp ? 'Loading' : 'Complete Signup'}</span>
          </button>
        </div>
        <p class="description">
            <a href="/" use:link>Back to Login</a>
        </p>
      </form>
    </div>
  </div>
  