<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { supabase } from '../supabaseClient'

  export let url: string

  let avatarUrl: string = null
  let uploading = false
  let files: FileList

  const dispatch = createEventDispatcher()

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path)

      if (error) {
        throw error
      }

      const url = URL.createObjectURL(data)
      avatarUrl = url
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }

  const uploadAvatar = async () => {
    try {
      uploading = true

      if (!files || files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      let { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (error) {
        throw error
      }

      url = filePath
      dispatch('upload')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      uploading = false
    }
  }

  $: if (url) downloadImage(url)
</script>

<div>
  <sl-avatar shape="rounded" image={avatarUrl} />
  <!-- TODO: This is NOT accessible to screen readers -->
  <label class="upload" for="profile-pic">
    <sl-button>Upload Avatar</sl-button>
  </label>
  <input
    class="visually-hidden"
    aria-label="Upload avatar"
    type="file"
    id="profile-pic"
    accept="image/*"
    bind:files
    on:change={uploadAvatar}
    disabled={uploading}
  />
</div>

<style>
  sl-avatar {
    --size: var(--account-avatar-size);
    margin-bottom: 1rem;
  }
  sl-button {
    display: inline;
    z-index: -1;
  }
  label.upload {
    width: var(--account-avatar-size);
    display: block;
  }

  label.upload:hover {
    cursor: pointer;
  }

  label.upload:hover sl-button::part(base) {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-300);
    color: var(--sl-color-primary-700);
  }
</style>
