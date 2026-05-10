import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { apiClient } from '../../api/client'
import { PlusCircle, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/poll/new')({ component: CreatePoll })

function CreatePoll() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [questions, setQuestions] = useState([{ text: '', options: [{ text: '' }, { text: '' }] }])

  const addQuestion = () => setQuestions([...questions, { text: '', options: [{ text: '' }, { text: '' }] }])
  const removeQuestion = (qIndex: number) => setQuestions(questions.filter((_, i) => i !== qIndex))
  const addOption = (qIndex: number) => {
    const newQs = [...questions]; newQs[qIndex].options.push({ text: '' }); setQuestions(newQs)
  }
  const removeOption = (qIndex: number, oIndex: number) => {
    const newQs = [...questions]; newQs[qIndex].options = newQs[qIndex].options.filter((_, i) => i !== oIndex); setQuestions(newQs)
  }
  const updateQuestionText = (qIndex: number, text: string) => {
    const newQs = [...questions]; newQs[qIndex].text = text; setQuestions(newQs)
  }
  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const newQs = [...questions]; newQs[qIndex].options[oIndex].text = text; setQuestions(newQs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: pollData } = await apiClient.post('/polls', { title, description, isAnonymous })
      const pollId = pollData.data.id
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        const { data: qData } = await apiClient.post(`/polls/${pollId}/questions`, { text: q.text, order: i, isMandatory: true })
        const qId = qData.data.id
        await Promise.all(q.options.map((opt, oIdx) => apiClient.post(`/questions/${qId}/options`, { text: opt.text, order: oIdx })))
      }
      await apiClient.put(`/polls/${pollId}/publish`)
      navigate({ to: '/dashboard' })
    } catch (err) {
      alert('Error creating poll')
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">Create New Poll</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-[#0f172a] p-6 rounded-xl border border-[#334155] space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Poll Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description (Optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="anon" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="anon" className="text-sm">Allow Anonymous Responses</label>
          </div>
        </div>
        
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-[#0f172a] p-6 rounded-xl border border-[#334155] space-y-4">
            <div className="flex justify-between items-start">
              <span className="font-semibold">Question {qIdx + 1}</span>
              {questions.length > 1 && <button type="button" onClick={() => removeQuestion(qIdx)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>}
            </div>
            
            <input type="text" required placeholder="What do you want to ask?" value={q.text} onChange={e => updateQuestionText(qIdx, e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-md px-4 py-2" />
            
            <div className="space-y-2 pl-4 border-l-2 border-[#1e293b]">
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">○</span>
                  <input type="text" required placeholder={`Option ${oIdx + 1}`} value={opt.text} onChange={e => updateOptionText(qIdx, oIdx, e.target.value)} className="flex-1 bg-[#1e293b] border border-[#334155] rounded-md px-4 py-1.5 text-sm" />
                  {q.options.length > 2 && <button type="button" onClick={() => removeOption(qIdx, oIdx)} className="text-gray-500 hover:text-gray-300"><Trash2 size={16} /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addOption(qIdx)} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mt-2">
                <PlusCircle size={14} /> Add Option
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button type="button" onClick={addQuestion} className="flex-1 py-3 border border-[#334155] text-white font-medium rounded-lg hover:bg-[#1e293b] transition-colors">Add Question</button>
          <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">Create & Publish Poll</button>
        </div>
      </form>
    </div>
  )
}
