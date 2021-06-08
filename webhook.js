const http = require('http');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const exec = require('child_process').exec;
const config = require('./config/config.json');
const winston = require('winston');
const { format } = require('winston');
const querystring = require( 'querystring' )

let app = null;


const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.splat(),
        format.simple()
        // format.prettyPrint()
      ),
    defaultMeta: { service: config.app_name },
    transports: [
      new winston.transports.File({ filename: config.error_log , level: 'error' }),
      new winston.transports.File({ filename: config.combined_log })
    ]
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }


let handler = (request, response) => {

    logger.info('New Request Raw Header %s ' , request.rawHeaders );
    if (request.url == '/webhook'){

        const { headers, method } = request;
        if (method === 'POST') {
            logger.info('New Request Token %s ' ,headers['x-gitlab-token'] );

            let body = [];
            request.on('data', (chunk) =>{
                body.push(chunk);
                // let sig = "sha1=" + crypto.createHmac('sha1', config.secret).update(chunk.toString()).digest('hex');
        
            });
    
            request.on('end',()=>{

                logger.info(' on End New Request Token %s ' ,headers['x-gitlab-token'] );

                // payload = JSON.parse( querystring.parse( body ).payload );

                let payload = JSON.parse(body)

                // logger.info('on End Request payLoad %s ' , payload );
                //logger.info('on End Request Raw Header %s ' ,  request.rawHeaders);
                let abc =  JSON.stringify(request.headers);

                if (request.headers['x-gitlab-token'] == config.secret) {
                    logger.info('New Request Token Compared %s ' ,  request.headers['x-gitlab-token']);
			exec("./deploy_agrideo.sh", (error, stdout, stderr) => {
                        if (error) {
                            logger.error(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            logger.error(`stderr: ${stderr}`);
                            return;
                        }
                        logger.info(`stdout: ${stdout}`);
                    });

                }

                logger.info('New Request Ended ' );
            response.writeHead(200, {'Content-Type': 'text/plain'});
                        response.end('Completed\n');

            })

            request.on('parserOnIncoming',(data) =>{
                logger.info('parserOnIncoming %s ' , data );
            })
            
//            response.writeHead(200, {'Content-Type': 'text/plain'});
//            response.end('Completed\n');

        }
    }
}  



if (config.secure_only == "no"){

    app = http.createServer(  handler );

    app.listen(config.server_port, config.server_ip,()=>{
        logger.info('Server Started InSecure on Port %d and IP %s  ',  config.server_port, config.server_ip);
    });
    
}else{

    const options = {
        key: fs.readFileSync(config.key_file),
        cert: fs.readFileSync(config.cert_file)
    };
    app = https.createServer(options,  handler );
    app.listen(config.server_port, config.server_ip, ()=>{
        logger.info('Server Started Secureon Port %d and IP %s  ',  config.server_port, config.server_ip);
    });
    
}






