import Footer from "../../app/main/Footer/Footer";
import { BackwardIcon, HomeIcon} from '@heroicons/react/24/solid'
import Link from "next/link";


export default function CookiePreferences() {
    return (
    <>
        <div className="bg-gray-900">
        <div className="px-4 py-12 mx-auto lg:py-8 sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 bg-gray-900">
            {/* Backward Icon positioned above */}
            <div className="relative flex flex-col items-start space-y-4">
            <Link href="/">
                <BackwardIcon className="h-6 w-6 text-white cursor-pointer" />
            </Link>

            {/* Title with Calendar Icon in Background */}
            <div className="relative">
                {/* Calendar Icon as background on the right */}
                <HomeIcon
                className="absolute top-0 right-0 text-white/10 h-24 w-24"
                aria-hidden="true"
                />

                {/* Title */}
                <h1 className="text-4xl font-medium text-white relative z-10">
                Back to Home
                </h1>
            </div>
            </div>
        </div>
        </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
        <div className="p-8 rounded-lg shadow-lg">
          <article id="main-content" className="article">
            <header className="article-header">
              <h1 title="Managing Your Cookie Preferences" className="article-title">
                Managing Your Cookie Preferences
              </h1>
            </header>
  
            <section className="article-info">
              <div className="article-content">
                <div className="article-body">
                  <p style={{ fontWeight: 400 }}>
                    At SocialPendo, we believe in being clear and open about how we collect and process data about you. 
                    This page is designed to inform you about our practices regarding cookies, and to explain how you can manage them.
                  </p>
                  <p>
                    <strong>You already know everything there is to know about cookies and just want to adjust your settings?</strong> 
                    No problem. Head{" "}
                    <a href="https://www.socialpendo.com/settings/privacy?cookies=true" target="_self">
                      here
                    </a>{" "}
                    to update your website cookie settings, and go to your account settings in the app to adjust your privacy preferences there.
                  </p>
                  <p>
                    <strong>You want to know more about cookies and how we use them?</strong> Happy to explain! Keep on reading.
                  </p>
                  <p>
                    <em>
                      Note: this Cookie Policy does not address how we process your personal information outside of our use of cookies. 
                      To learn more about how we process your personal information, please read our Privacy Policy,{" "}
                    </em>
                    <a href="/hc/en-us/articles/22780694078491">here</a>
                    <em>.</em>
                  </p>
  
                  <p>
                    <strong>What are cookies?</strong>
                  </p>
                  <p style={{ fontWeight: 400 }}>
                    Cookies are small text files that are sent to or accessed from your web browser or your device’s memory. 
                    A cookie typically contains the name of the domain from which it originated, the “lifetime” of the cookie, and a randomly generated identifier.
                  </p>
  
                  <p>
                    <strong>Are there different types of cookies?</strong>
                  </p>
                  <p>
                    <em>First-party and third-party cookies</em>
                  </p>
                  <p style={{ fontWeight: 400 }}>
                    First-party cookies are placed on your device directly by us. Third-party cookies are placed on your device by our partners and service providers.
                  </p>
  
                  <p>
                    <strong>What do we use cookies for?</strong>
                  </p>
                  <p style={{ fontWeight: 400 }}>
                    Like other providers of online services, we use cookies to provide, secure, and improve our services.
                  </p>
  
                  <table style={{ borderCollapse: "collapse", width: "100%", border: "1px solid white" }}>
                    <tbody>
                      <tr>
                        <td style={{ width: "24%", fontWeight: "bold" }}>Cookie type</td>
                        <td style={{ width: "76%", fontWeight: "bold" }}>Description</td>
                      </tr>
                      <tr>
                        <td style={{ width: "24%" }}>
                          <strong>Essential cookies</strong>
                        </td>
                        <td style={{ width: "76%" }}>
                          These cookies are necessary for providing our services, such as enabling login and detecting malicious activity.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Analytics cookies</strong>
                        </td>
                        <td>
                          These cookies help us understand how our services are used and allow us to improve them.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Advertising & marketing cookies</strong>
                        </td>
                        <td>
                          These cookies track the effectiveness of marketing campaigns and personalize ads.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Social networking cookies</strong>
                        </td>
                        <td>
                          These cookies allow users to share content via social networks and may be used for advertising.
                        </td>
                      </tr>
                    </tbody>
                  </table>
  
                  <p>
                    <strong>How can you control cookies?</strong>
                  </p>
                  <p>
                    <em>Tools we provide</em>
                  </p>
                  <p>
                    You can adjust your cookie preferences anytime on our{" "}
                    <a href="https://www.socialpendo.com/settings/privacy?cookies=true" target="_self">
                      website
                    </a>
                    .
                  </p>
  
                  <p>
                    <strong>How to contact us?</strong>
                  </p>
                  <p>
                    If you have questions about this Cookie Policy, here’s how you can contact us:
                  </p>
                  <p>
                    <strong>If you live in the European Economic Area, the United Kingdom, or Switzerland:</strong>
                  </p>
                  <p>
                    Online:{" "}
                    <a href="/hc/en-us/requests/new?ticket_form_id=22397928645915">
                      <span className="wysiwyg-color-red">here</span>
                    </a>
                  </p>
  
                </div>
              </div>
            </section>
          </article>
        </div>
      </div>
      <Footer/>
    </>
    );
  }
  