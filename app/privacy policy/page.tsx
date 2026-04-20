import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for TecSub Solutions — Website, Mobile App & Browser Extensions. Learn how we protect your data and privacy.",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 text-gray-300">
      <h1 className="text-4xl font-bold text-white mb-8">
        Privacy Policy for TecSub Solutions (Website, Mobile App &amp; Browser Extensions)
      </h1>
      <p className="mb-6 text-sm text-gray-400">Last Updated: April 20, 2026</p>
      <p className="mb-8">
        At TecSub Solutions, accessible from{" "}
        <a
          href="https://tecsubsolution.kozow.com/"
          className="text-tecsubCyan hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://tecsubsolution.kozow.com/
        </a>
        , our mobile application <strong className="text-white">TECSUB</strong>, and our Chrome
        extension <strong className="text-white">Data Grab V5</strong>, one of our main priorities
        is the privacy of our visitors and users. This Privacy Policy document contains types of
        information that is collected and recorded by TecSub Solutions and how we use it.
      </p>

      {/* ── 1. No Data Collection Policy ── */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">1. No Data Collection Policy</h2>
        <p className="mb-4">
          We want to state clearly that TecSub Solutions does{" "}
          <strong className="text-white">NOT</strong> collect, store, or share any personally
          identifiable information (PII) from our mobile application, website, or browser extensions.
        </p>
        <ul className="list-disc list-inside space-y-3 ml-4">
          <li>
            <strong className="text-white">Website &amp; App:</strong> You can browse anonymously
            without providing any personal data.
          </li>
          <li>
            <strong className="text-white">Chrome Extension (Data Grab V5):</strong> All data
            extraction processes are performed locally on your browser. We do not transmit the
            extracted YouTube data, comments, or metadata to any external servers. The data stays on
            your machine until you choose to download it as a CSV or Excel file.
          </li>
        </ul>
      </section>

      {/* ── 2. Website Usage (Log Files) ── */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">2. Website Usage (Log Files)</h2>
        <p>
          TecSub Solutions follows a standard procedure of using log files. These files log visitors
          when they visit websites. The information collected includes IP addresses, browser type,
          Internet Service Provider (ISP), date/time stamps, and referring/exit pages. These are not
          linked to any information that is personally identifiable and are used solely for analyzing
          trends and administering the site.
        </p>
      </section>

      {/* ── 3. Permissions & Justifications ── */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">
          3. Permissions &amp; Justifications
        </h2>

        {/* Mobile */}
        <h3 className="text-xl font-medium text-white mt-4 mb-3">Mobile Application Permissions</h3>
        <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
          <li>
            <strong className="text-white">Internet Access:</strong> Required to load content,
            updates, and tech tools.
          </li>
          <li>
            <strong className="text-white">Device Settings:</strong> To support user preferences like
            Dark Mode and language selection (Sinhala, Tamil, English).
          </li>
        </ul>

        {/* Chrome Extension */}
        <h3 className="text-xl font-medium text-white mb-3">
          Chrome Extension Permissions (Data Grab V5)
        </h3>
        <p className="mb-3">
          To provide advanced data extraction features, the extension requires the following:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong className="text-white">Host Permissions (<code className="text-sm bg-yt-bg-elevated px-1.5 py-0.5 rounded">*://*.youtube.com/*</code>):</strong>{" "}
            To access and extract public data from YouTube pages.
          </li>
          <li>
            <strong className="text-white">Scripting:</strong> To interact with the YouTube DOM for
            capturing tags and comments.
          </li>
          <li>
            <strong className="text-white">ActiveTab:</strong> To perform extraction only on the
            specific tab the user interacts with.
          </li>
          <li>
            <strong className="text-white">Storage:</strong> To save user-specific settings and
            export preferences locally.
          </li>
          <li>
            <strong className="text-white">Notifications &amp; Alarms:</strong> To alert the user
            when a long-running extraction (like large comment threads) is complete.
          </li>
        </ul>
      </section>

      {/* ── 4. Data Processing (Browser Extension) ── */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">
          4. Data Processing (Browser Extension)
        </h2>
        <p className="mb-4">
          The &ldquo;Advanced YouTube Data Extraction&rdquo; tool is designed to facilitate user-led
          research.
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>We do not sell, trade, or rent any data extracted by the user.</li>
          <li>
            The extension does not use any &ldquo;Remote Code&rdquo; or external scripts that could
            compromise user security.
          </li>
          <li>
            All exported files (CSV/XLSX) are generated instantly within the user&apos;s browser
            environment.
          </li>
        </ul>
      </section>

      {/* ── 5. Third-Party Links ── */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">5. Third-Party Links</h2>
        <p>
          Our platforms may contain links to third-party sites, such as YouTube or social media
          profiles. We are not responsible for the privacy practices or content of these external
          sites. We encourage users to read the privacy policies of any third-party services they
          visit.
        </p>
      </section>

      {/* ── 6. Children's Information ── */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">
          6. Children&apos;s Information
        </h2>
        <p>
          We do not knowingly collect any Personal Identifiable Information from children under the
          age of 13. If you believe your child has provided such information on our platforms, please
          contact us immediately, and we will remove it promptly.
        </p>
      </section>

      {/* ── 7. Consent ── */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">7. Consent</h2>
        <p>
          By using our website, mobile application, or browser extensions, you hereby consent to our
          Privacy Policy and agree to its terms.
        </p>
      </section>

      {/* ── 8. Contact Information ── */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-tecsubCyan mb-4">8. Contact Information</h2>
        <p className="mb-3">
          If you have additional questions or require more information about our Privacy Policy, do
          not hesitate to contact{" "}
          <strong className="text-white">Hasantha Medagedara</strong> (Founder, TecSub Solutions):
        </p>
        <ul className="space-y-2 ml-4">
          <li>
            <strong className="text-white">Email:</strong>{" "}
            <a
              href="mailto:tecsubsolutions@gmail.com"
              className="text-tecsubCyan hover:underline"
            >
              tecsubsolutions@gmail.com
            </a>
          </li>
          <li>
            <strong className="text-white">Phone:</strong>{" "}
            <a href="tel:+94726128749" className="text-tecsubCyan hover:underline">
              +94-726128749
            </a>
          </li>
          <li>
            <strong className="text-white">Website:</strong>{" "}
            <a
              href="https://tecsubsolution.kozow.com/"
              className="text-tecsubCyan hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://tecsubsolution.kozow.com/
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}