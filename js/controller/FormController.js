class FormController {

    constructor (){

        //elementos HTML
        this.formEl = document.querySelector('#register-form')
        this.btnSubmitEl = this.formEl.querySelector('#btn-submit')
        this.inputPasswordEl = this.formEl.querySelector('#input-password')
        this.agreementEl = this.formEl.querySelector('#input-agreement')

        //array com datasets que virarão métodos
        this.validations = [
            'data-required',
            'data-min-length',
            'data-max-length',
            'data-email-validate',
            'data-letters-only',
            'data-same-password',
            'data-password-validate',
            'data-check-agreement'
        ]
        
        this.onSubmit()
    }
    
    //méotodo para enviar formulário
    onSubmit (){
        
        this.formEl.addEventListener('submit', event => {
    
            event.preventDefault()

            this.validateForm(this.formEl)  //executa o método para validar formulário      
                
        })
    }

    //método para validar formulário
    validateForm(form){
       
        let inputs = form.querySelectorAll('input') //seleciona todos os inputs do formulário
        let errorValidations = form.querySelectorAll('.error-validation') //seleciona os input do formulário que contém a classe de erro (parágrafo de erro)
        
        if (errorValidations.length > 0) {  //se houver algum input com esta classe,

            this.clearValidations(errorValidations)   //executa o método que limpa o elemento parágrafo

        }
        
        inputs.forEach(input => {              
          
            for (let i = 0; i < this.validations.length; i++){  //executa todo array de validações, um por um

                if (input.getAttribute(this.validations[i]) != null){   //verifica se existe esta validação neste campo (ex: name.getAttribute('data-min-length') = 3 / email.getAttribute('data-min-length') = null)
                   
                   let method = this.validations[i].replace('data-', '').replace('-', '')   //cria um nome limpo para servir de método

                   let value = input.getAttribute(this.validations[i])  //recebe o valor do atributo                   

                   this[method](input, value)   //cria o método com o nome limpo, passando o input e o valor do atributo

                }
            }            
        })

        this.formEl.reset() //limpa o formulário
    }

    //método para verificar se o campo tem no mínimo x caracteres 
    minlength(input, minValue){

        let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres.` //cria a mensagem de erro, recebendo o valor mínimo de caracteres

        if (input.value.length < minValue) this.printMessage(input, errorMessage)    //faz a validação se campo foi preenchido com caracteres menores que o terminado, chama o método que printa o erro na tela

    }

    //método para verificar se o campo tem no máximo x caracteres 
    maxlength(input, maxValue){

        let errorMessage = `O campo precisa ter no máximo ${maxValue} caracteres.` //cria a mensagem de erro, recebendo o valor máximo de caracteres

        if (input.value.length > maxValue) this.printMessage(input, errorMessage)     //faz a validação se campo foi preenchido com caracteres menores que o terminado, chama o método que printa o erro na tela            
        
    }

    //método para verificar se o email contém os caracteres @ e .
    emailvalidate(input){

        let re = /\S+@\S+\.\S/  //regular expressions
        
        let errorMessage = `Insira um e-mail válido (ex: jorge@email.com)`  //cria a mensagem de erro

        if (!re.test(input.value)) this.printMessage(input, errorMessage)   //se o campo não respeitar as "regras", chama o método que printa o erro na tela

    }
    
    //método para verificar se o campo é obrigatório
    required(input){

        if (input.value == ''){

            let errorMessage = 'Este campo é obrigatório.'

            this.printMessage(input, errorMessage)  //chama o método que printa o erro na tela

        }
    }

    //método para verificar se o campo possui apenas letras
    lettersonly(input){

        let re = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/ //regular expressions

        let errorMessage = `O campo pode conter apenas letras.`   //cria a mensagem de erro

        if (!re.test(input.value)) this.printMessage(input, errorMessage)   //se o campo não respeitar as "regras", chama o método que printa o erro na tela   
            
    }

    //método para validar a senha
    passwordvalidate(input){

        let password = input.value.split("")    //cria um array com cada caracter da senha

        let uppercasesCount = 0     //cria contador de letras maíusculas

        let numbersCount = 0        //cria contador de números

        let errorMessage = `As senhas devem conter pelo menos:<br>
        - uma letra maiúscula;<br>
        - um número.
        `

        password.forEach(char => {  //percorre cada caracter da senha            

            if (char === char.toUpperCase() && isNaN(parseInt(char))) { //se o caracter for maiúsculo E não for um número
                                
                uppercasesCount++   //adiciona +1 no contador de maiúsculas              
               
            } else if (!isNaN(parseInt(char))){    //se o caracter for número (não [não for número])

                numbersCount++  //adiciona +1 no contador de números             

            }    
        })

        if (uppercasesCount === 0 || numbersCount === 0) this.printMessage(input, errorMessage) //se algum dos contadores for 0, chama o método que printa o erro na tela
      
    }

    //método para conferir se a confirmação de senha é igual ao campo senha
    samepassword(input){       

        let errorMessage = `As senhas devem ser idênticas.` //cria a mensagem de erro

        if (input.value != this.inputPasswordEl.value) this.printMessage(input, errorMessage)   //se o valor do campo atual for diferente do campo Senha, 

    }

    //método para checar o checkbox
    checkagreement(input){

        let errorMessage = `Este campo é obrigatório.`  //cria a mensagem de erro

        if (!input.checked) this.printMessage(input, errorMessage)  //se o campo não estiver checado, chama o método que printa o erro na tela

    }

    //méotodo para printar o erro na tela, recebendo a mensagem e o input que será exibido o erro
    printMessage(input, msg){

        let p = document.createElement('p') //cria o parágrafo dinamicamente

        if (input.parentNode.querySelector('.error-validation') === null) { //se não tiver nenhum outro erro neste elemento, (para evitar de printar mais de um erro no mesmo input)
           
            p.classList.add('error-validation') //adiciona classe de erro no parágrafo
                       
            p.innerHTML = msg   //adiciona a mensagem de erro como texto do parágrafo
            
            input.parentNode.appendChild(p) //insere o parágrafo no pai do elemento (div)     

        }

        if (input == this.agreementEl) {    //se o campo for o checkbox         

            p.classList.add('error-agreement-validation')   //adiciona outra classe de erro (para sobrepôr o top:)

        }
    }    

    //método para limpar validações
    clearValidations(validations){

        validations.forEach(el => el.remove())  //remove o elemento parágrafo de erro de cada input que conter um 
        
    }
}