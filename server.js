//configurando o servidor
const express = require("express")
const server = express()

//configurando o servidor para apresentar arquivos estáticos(arquivos extras como scripts, css)
server.use(express.static('public'))

//habilitar o body do formulario
server.use(express.urlencoded({extended:true}))

//configurar conexao com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user:'postgres',
    password:'1234',
    host:'localhost',
    port:5432,
    database:'postgres'
})

//configurando a template engine
const nunjucks = require("nunjucks")
  nunjucks.configure("./", {
      express: server,
      noCache: true, //nao deixa o navegador salvar caches
  })               

//configuar a apresentação da pagina
server.get('/', function(req, res){
    
    db.query(`SELECT * FROM donors;`, function(err, result){
        if (err) return res.send("Erro de banco de dados")

        const donors = result.rows

        const reverseDonor =  [...donors].reverse()
        
        let lastDonor=[]
      
        for (donor of reverseDonor) {
            
            if (lastDonor.length<4){
                lastDonor.push(donor)
            }
        }

        return res.render('index.html', {donors : lastDonor})
    })

    
})

server.post('/', function(req,res) {
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name=="" || email=="" || blood==""){
        return res.send("Preencha todos os campos!")
    }

    //coloco valores dentro do banco de dados
    const query = `INSERT INTO donors ("name","email","blood") values ($1, $2, $3);`

    const values = [name, email, blood]

    db.query(query, values, function(err){
        //fluxo de erro
        if (err) return res.send("Erro no banco de dados.")
        //fluxo ideal
        return res.redirect('/')
    })
    
})

 
//ligar o servidor e permitir o acesso na porta 3000
server.listen('3000', e=>{
    
})