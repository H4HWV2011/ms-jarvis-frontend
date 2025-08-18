import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const chatWithMsJarvis = async () => {
    if (!message.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })
      
      const data = await res.json()
      setResponse(data.response || 'Ms. Jarvis is thinking...')
    } catch (error) {
      setResponse("Well sugar, I'm having trouble connecting right now, darlin'. Please try again!")
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>MountainShares AI - World's First Community-Controlled AI</title>
        <meta name="description" content="Experience authentic Appalachian AI with Ms. Jarvis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-mountain-green to-appalachian-blue">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              🏔️ MountainShares AI
            </h1>
            <p className="text-xl text-mountain-gold mb-2">
              World's First Community-Controlled AI Assistant
            </p>
            <p className="text-lg text-white">
              Created by Carrie Ann Kidd • Serving Appalachian Communities
            </p>
          </div>

          {/* Chat Interface */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="bg-mountain-green text-white p-6">
              <h2 className="text-2xl font-bold mb-2">💬 Chat with Ms. Jarvis</h2>
              <p className="text-mountain-gold">
                Your friendly Appalachian AI guide • Darwin Gödel Machine powered
              </p>
            </div>

            <div className="p-6">
              {/* Message Input */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Ask Ms. Jarvis about MountainShares, blockchain, or Appalachian communities:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here, honey child!"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mountain-green"
                  rows="4"
                />
              </div>

              {/* Send Button */}
              <div className="mb-6">
                <button
                  onClick={chatWithMsJarvis}
                  disabled={loading}
                  className="w-full bg-mountain-green text-white py-3 px-6 rounded-lg hover:bg-opacity-90 disabled:opacity-50 font-bold text-lg"
                >
                  {loading ? '🤖 Ms. Jarvis is thinking...' : '💬 Chat with Ms. Jarvis'}
                </button>
              </div>

              {/* Response */}
              {response && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-mountain-green mb-3 flex items-center">
                    🏔️ Ms. Jarvis says:
                  </h3>
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {response}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold text-mountain-green mb-2">🤖 AI Innovation</h3>
              <p className="text-gray-700">First community-controlled AI with 90% cultural sensitivity</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold text-mountain-green mb-2">🏔️ Cultural Heritage</h3>
              <p className="text-gray-700">Preserving Appalachian expressions in digital technology</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold text-mountain-green mb-2">⛓️ Blockchain Education</h3>
              <p className="text-gray-700">Teaching blockchain technology "the mountain way"</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-white">
            <p className="mb-2">🎉 Historic Achievement: World's First Community-Controlled AI Assistant</p>
            <p className="text-mountain-gold">
              Serving Mount Hope, WV • Oakvale, WV • Appalachian Communities Worldwide
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
