import Link from 'next/link'
export default function LoginPage(){
    return(
        <div>
            <div className="main">
                <h1 className="logo">RVSM Log-in</h1>
                <div className="container">
                   
                        <input type="text" placeholder="ID" name="id" className="input_box"/>
                        <input type="password" placeholder="Password" className="input_box"/>
                        <Link href="/PatientStatePage">
                            <button id="login" >login</button>
                        </Link>
                        
                        <p id="alert" > </p>
                    
                       
                   
                </div>        
            </div> 
            <style jsx>
              {`
                .main {
                  position: absolute;
                  left:50%;
                  top:50%;
                  transform: translate(-50%,-50%);
                  width: 250px;
                  height: 300px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  flex-direction: column;
                  border: 1px solid lightgrey;
                  border-radius: 5px;
                }
              
                .logo {
                  margin-top: 0px;
                  margin-bottom: 40px;
                }
              
                #login {
                  width: 100%;
                  background-color: skyblue;
                  border-color: transparent;
                  color: white;
                  margin-top:10px
                }
              
                .input_box {
                  display: block;
                  margin-bottom: 3px;
                  padding: 3px;
                  border: 1px solid lightgray;
                  border-radius: 3px;
                  margin: 3px auto
                }
              
                #alert {
                  border-color: transparent;
                }
              `}
            </style>
        </div>
    )
}
