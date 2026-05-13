import express, { type Express } from 'express'
import cors from 'cors';
import authRouter from './modules/auth/auth.routes'
import pollsRouter from './modules/polls/polls.routes'
import questionsRouter from './modules/questions/questions.routes'
import optionsRouter from './modules/options/options.routes'
import responsesRouter from './modules/responses/responses.routes'
import errorMiddleware from './common/middleware/error.middleware';

export function createApplication(): Express {
    const app = express()

    // Middlewares
    app.use(express.json())
    app.use(cors({
        origin: '*',
        credentials: true
    }));


    // Routes
    app.get('/', (req, res) => {
        return res.json({ message: 'Welcome to  Auth Service' })
    })

    app.use('/api/auth', authRouter)
    app.use('/api/polls', pollsRouter)
    app.use('/api/polls/:pollId/questions', questionsRouter)
    app.use('/api/questions/:questionId/options', optionsRouter)
    app.use('/api/polls/:pollId/responses', responsesRouter)


    app.use(errorMiddleware);

    return app
}