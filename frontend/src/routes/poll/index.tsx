import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { apiClient } from '../../api/client'

export const Route = createFileRoute('/poll/')({ component: TakePoll })

function TakePoll() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [poll, setPoll] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get(`/polls/${id}`).then(res => {
      setPoll(res.data.data)
      setLoading(false)
    }).catch(err => {
      alert("Poll not found")
      setLoading(false)
    })
  }, [id])

  const submitResponse = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, oId]) => ({ questionId: qId, optionId: oId }))
      await apiClient.post(`/polls/${id}/responses`, { answers: formattedAnswers })
      navigate({ to: `/poll/${id}/analytics` })
    } catch (err) {
      alert('Failed to submit response')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!poll) return <div>Poll not found</div>

  return (
    <div className="max-w-2xl mx-auto w-full pt-10">
      <div className="bg-[#0f172a] p-8 rounded-xl border border-[#334155] shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">{poll.title}</h1>
        {poll.description && <p className="text-gray-400">{poll.description}</p>}
      </div>

      <div className="space-y-6">
        {poll.questions?.map((q: any, i: number) => (
          <div key={q.id} className="bg-[#0f172a] p-6 rounded-xl border border-[#334155]">
            <h3 className="font-semibold text-lg mb-4">{i + 1}. {q.text}</h3>
            <div className="space-y-3">
              {q.options?.map((opt: any) => (
                <label key={opt.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#334155] hover:bg-[#1e293b] cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name={q.id} 
                    value={opt.id}
                    checked={answers[q.id] === opt.id}
                    onChange={() => setAnswers({...answers, [q.id]: opt.id})}
                    className="w-4 h-4 text-blue-600 bg-gray-800"
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={submitResponse} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">
          Submit Response
        </button>
      </div>
    </div>
  )
}
