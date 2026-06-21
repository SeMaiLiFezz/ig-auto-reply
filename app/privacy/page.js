export const metadata = {
  title: 'Privacy Policy · IG Auto Reply',
}

export default function PrivacyPolicy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: June 21, 2026</p>

      <p className="mb-4">
        IG Auto Reply (&quot;the App&quot;) is a personal automation tool that sends an
        automatic Instagram Direct Message in reply to comments containing a configured
        keyword. This policy explains what data the App uses and how it is handled.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">Information we use</h2>
      <ul className="list-disc pl-6 space-y-1 mb-4">
        <li>The connected Instagram account&apos;s ID, username, and profile picture.</li>
        <li>An Instagram access token used to call the Instagram API on the account&apos;s behalf.</li>
        <li>
          Public comment data (comment text and comment ID) delivered by Instagram webhooks,
          used only to detect the keyword and send the reply.
        </li>
      </ul>

      <h2 className="text-lg font-semibold mt-8 mb-2">How we use it</h2>
      <p className="mb-4">
        Data is used solely to operate the comment-to-DM automation for the connected account.
        We do not sell, share, or use this data for advertising or any other purpose.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">Data storage and retention</h2>
      <p className="mb-4">
        Configuration (keyword, message, access token, connected account details) is stored
        in Vercel Edge Config to operate the App. Comment data is processed in real time and
        not retained beyond what is needed to send a single reply. You can remove all stored
        data at any time by disconnecting the account or deleting the configuration.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">Data deletion</h2>
      <p className="mb-4">
        To request deletion of your data, remove the App&apos;s access from your Instagram
        account settings (Settings &rarr; Apps and websites) or contact us at the email below.
        Stored configuration and tokens will be deleted upon request.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">Third parties</h2>
      <p className="mb-4">
        The App relies on Meta&apos;s Instagram Platform (to receive comments and send messages)
        and Vercel (to host the App and store configuration). Their handling of data is governed
        by their respective privacy policies.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">Contact</h2>
      <p className="mb-4">
        For any privacy questions or deletion requests, contact:{' '}
        <a className="text-purple-600 underline" href="mailto:javierandros123@gmail.com">
          javierandros123@gmail.com
        </a>
        .
      </p>
    </main>
  )
}
