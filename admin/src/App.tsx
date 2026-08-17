import { useState } from 'react';

export default function App() {
  const [title, setTitle] = useState('');
  const [category, setCategory] =
    useState('campaign_tunes');
  const [description, setDescription] =
    useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [skizaCode, setSkizaCode] =
    useState('');
  const [file, setFile] =
    useState<File | null>(null);
  const [message, setMessage] =
    useState('');
  const [uploading, setUploading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    console.log('Submit clicked');

    if (!file || !title.trim()) {
      console.log(
        'Missing title or file'
      );

      setMessage(
        'Please choose a file and enter a title.'
      );

      return;
    }

    console.log('File:', file.name);
    console.log('File size:', file.size);
    console.log('File type:', file.type);

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();

      formData.append(
        'title',
        title.trim()
      );

      formData.append(
        'description',
        description
      );

      formData.append(
        'category',
        category
      );

      formData.append(
        'isPaid',
        String(isPaid)
      );

      formData.append(
        'skizaCode',
        skizaCode
      );

      /*
       * IMPORTANT:
       * The backend expects the file field
       * to be called "file".
       */
      formData.append(
        'file',
        file,
        file.name
      );

      /*
       * Debug FormData
       */
      for (const [
        key,
        value,
      ] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            'FormData:',
            key,
            value.name,
            value.size,
            value.type
          );
        } else {
          console.log(
            'FormData:',
            key,
            value
          );
        }
      }

      const apiBase =
        import.meta.env.VITE_API_URL ||
        '/api';

      const uploadUrl =
        `${apiBase}/admin/audio/upload`;

      console.log(
        'Upload URL:',
        uploadUrl
      );

      console.log(
        'Sending multipart request...'
      );

      const response = await fetch(
        uploadUrl,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log(
        'Response status:',
        response.status
      );

      const payload =
        await response
          .json()
          .catch(() => ({}));

      console.log(
        'Response payload:',
        payload
      );

      if (!response.ok) {
        setMessage(
          payload.error ||
            `Upload failed (${response.status}).`
        );

        return;
      }

      setMessage(
        'Audio uploaded successfully.'
      );

      /*
       * Clear form after successful upload
       */
      setTitle('');
      setDescription('');
      setCategory(
        'campaign_tunes'
      );
      setIsPaid(false);
      setSkizaCode('');
      setFile(null);

      /*
       * Reset file input
       */
      const fileInput =
        document.getElementById(
          'audio-file'
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error(
        'Upload request failed:',
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : 'Upload failed.'
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#07111f',
        color: '#f8f8f8',
        fontFamily:
          'Inter, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '48px 24px',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            marginBottom: '8px',
          }}
        >
          Almas Admin
        </h1>

        <p
          style={{
            color: '#9ca3af',
            marginBottom: '24px',
          }}
        >
          Upload audio content for
          the public site.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gap: '16px',
            background: '#0f172a',
            padding: '24px',
            borderRadius: '16px',
          }}
        >
          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Title"
            required
            disabled={uploading}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border:
                '1px solid #334155',
            }}
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            disabled={uploading}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border:
                '1px solid #334155',
            }}
          >
            <option value="campaign_tunes">
              Campaign Tunes
            </option>

            <option value="church_audio">
              Church Audio
            </option>

            <option value="native_languages">
              Native Languages
            </option>

            <option value="business_greetings">
              Business Greetings
            </option>

            <option value="hold_music">
              Hold Music
            </option>

            <option value="voice_overs">
              Voice Overs
            </option>
          </select>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Description"
            rows={3}
            disabled={uploading}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border:
                '1px solid #334155',
            }}
          />

          <input
            value={skizaCode}
            onChange={(e) =>
              setSkizaCode(
                e.target.value
              )
            }
            placeholder="Skiza code"
            disabled={uploading}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border:
                '1px solid #334155',
            }}
          />

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) =>
                setIsPaid(
                  e.target.checked
                )
              }
              disabled={uploading}
            />

            Paid tune
          </label>

          <input
            id="audio-file"
            type="file"
            accept="audio/*"
            disabled={uploading}
            onChange={(e) =>
              setFile(
                e.target.files?.[0] ??
                  null
              )
            }
          />

          <button
            type="submit"
            disabled={uploading}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: uploading
                ? '#6b7280'
                : '#f59e0b',
              color: '#111827',
              fontWeight: 700,
              cursor: uploading
                ? 'not-allowed'
                : 'pointer',
              border: 'none',
            }}
          >
            {uploading
              ? 'Uploading...'
              : 'Upload audio'}
          </button>

          {message ? (
            <p
              style={{
                color: '#fbbf24',
              }}
            >
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}