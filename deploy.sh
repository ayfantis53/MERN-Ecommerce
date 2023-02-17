
#docker build -t ayfantis53/ecommerce-client:latest -t ayfantis53/ecommerce-client:$SHA -f ./client/Dockerfile ./client
#docker build -t ayfantis53/ecommerce-server:latest -t ayfantis53/ecommerce-server:$SHA -f ./server/Dockerfile ./server

#docker push ayfantis53/ecommerce-client:latest
#docker push ayfantis53/ecommerce-server:latest

#docker push ayfantis53/ecommerce-client:$SHA
#docker push ayfantis53/ecommerce-server:$SHA

echo "starting"
aws eks --region us-east-2 describe-cluster --name eks-cluster --query cluster.status
kubectl get svc

echo "installing Ingress-Nginx"
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.3.1/deploy/static/provider/aws/deploy.yaml

echo "applying k8 files"
kubectl apply -f ./k8s/

#kubectl set image deployments/server-deployment server=ayfantis53/ecommerce-server:$SHA
#kubectl set image deployments/client-deployment client=ayfantis53/ecommerce-client:$SHA

echo "done"