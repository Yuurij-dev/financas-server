import express from 'express'
import cors from 'cors'
import mysql from 'mysql'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// Mostrar Valores
app.get("/controle", (req,res) => {   
    const q = "SELECT * FROM transacoes"

    db.query(q, (err, data) => {
        if(err) return res.status(500).json(err)
        return res.json(data)
    })
})

// Inserir valores
app.post("/controle", (req,res) => {
    const q = "INSERT INTO transacoes (tipo, descricao, valor, data) VALUES ?"

    const values = [
        ['receita', 'Salário', 3000.00, '2025-05-01'],
        ['despesa', 'Aluguel', 1200.00, '2025-05-02'],
        ['despesa', 'Mercado', 350.75, '2025-05-03']
    ];

    db.query(q, [values], (err, result) => {
        if(err) return res.status(500).json(err)
        res.status(200).json({ message: "Transações inseridas com sucesso!", result });
    })
}, [])

// Inserir Receita
app.post("/receita", (req,res) => {
    const q = "INSERT INTO transacoes (tipo, descricao, valor, data) VALUES (?)"

    const values = [
        req.body.tipo,
        req.body.descricao,
        req.body.valor,
        req.body.data
    ];

    db.query(q, [values], (err, result) => {
        if(err) return res.status(500).json(err)
        res.status(200).json({ message: "Transações inseridas com sucesso!", result });
    })
}, [])

// Inserir Despesa
app.post("/despesa", (req,res) => {
    const q = "INSERT INTO transacoes (tipo, descricao, valor, data) VALUES (?)"

    const values = [
        req.body.tipo,
        req.body.descricao,
        req.body.valor,
        req.body.data
    ];

    db.query(q, [values], (err, result) => {
        if(err) return res.status(500).json(err)
        res.status(200).json({ message: "Transações inseridas com sucesso!", result });
    })
}, [])


// Verificar receita
app.get('/transacoes', (req, res) => {
    const q = 
    "SELECT SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) AS total_receitas,SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) AS total_despesas, SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) - SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) AS saldo_total FROM transacoes;"

    db.query(q, (err, result) => {
        if(err) return res.status(500).json(err)
        
        res.status(200).json({
            message: "Sucesso em receber transações",
            saldo_total: result[0].saldo_total,
            total_receitas: result[0].total_receitas,
            total_despesas: result[0].total_despesas
        })
    })
})

// Deleta transações
app.delete('/controle/:id', (req, res) => {
    const transacaoId = req.params.id
    const q = "DELETE FROM transacoes WHERE id = ?"

    db.query(q, [transacaoId], (err, data) => {
        if(err) return res.status(500).json(err)
        return res.json({message: "Deletado com sucesso!"})
    })
})


// Verificar Login
app.post("/login", (req, res) =>{
    const q = "SELECT * FROM users WHERE username = ? AND pass = ?"
    const values = [
        req.body.username,
        req.body.pass
    ]
    db.query(q, values, (err, data) => {
        if(err) return res.status(500).json(err)

        if(data.length > 0){
            return res.json({message: "Usuario logado com sucesso"})
        }else{
            return res.status(401).json({message: "Usuario ou senha incorretos!"})
        }
    })
})

app.listen(3333, () => {
    console.log("conectado no backend")
})