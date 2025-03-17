<details>
    <summary>2025-03-18</summary>

# 1. 현재 Msa 방식으로 배포를 진행 중입니다.

![alt text](images/msa-diagram.svg)

- k3s를 이용하여 배포를 진행 도중 ks3 자체 ip 주소를 이용하는 treafic과 nginx ingress 와 충돌하는 것을 약 10시간만에 깨닫게 되었습니다...!

# 2. 그래서 현재 프론트파일을 도커 허브에 업로드 해놓았고 그 이미지를 pull 받아서 띄우는 형태를 구성하려고 하였으나 충돌로 인하여 k3s -> 바닐라 쿠바네티스를 이용하고자 하였습니다.

# 쿠버네티스 기반 마이크로서비스 아키텍처 설정 진행상황

## 완료된 작업

### 1. k3s 제거 및 바닐라 쿠버네티스 설치

```bash
# K3S 제거
/usr/local/bin/k3s-uninstall.sh

# 쿠버네티스 구성요소 설치
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

```

### 2. 시스템 설정

```bash
# swap 비활성화 (Kubernetes 요구사항)
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# 필요한 커널 모듈 활성화
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter

# 필요한 sysctl 파라미터 설정
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sudo sysctl --system

```

### 3. Containerd 설정

```bash
# containerd 설정
sudo mkdir -p /etc/containerd
sudo containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup \= false/SystemdCgroup \= true/g' /etc/containerd/config.toml
sudo systemctl restart containerd
sudo systemctl enable containerd

# Docker 설정 조정 (containerd와 호환되도록)
sudo mkdir -p /etc/docker
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF
sudo systemctl restart docker

```

### 4. 쿠버네티스 클러스터 초기화

```bash
# 쿠버네티스 클러스터 초기화
sudo kubeadm init --pod-network-cidr=10.244.0.0/16

# kubeconfig 설정
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

```

### 5. 네트워크 및 인그레스 설정

```bash
# Calico CNI 설치
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/calico.yaml

# 단일 노드 클러스터에서 워크로드 실행 허용
kubectl taint nodes --all node-role.kubernetes.io/control-plane-

# kubectl 경로 문제 해결
sudo ln -s /usr/bin/kubectl /usr/local/bin/kubectl
echo 'export PATH=$PATH:/usr/bin' >> ~/.bashrc
source ~/.bashrc

# Nginx Ingress Controller 설치
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.4/deploy/static/provider/cloud/deploy.yaml

```

### 6. SSL 인증서 관리 설정

```bash
# cert-manager 설치
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# ClusterIssuer 설정 (Let's Encrypt)
cat > cluster-issuer.yaml << EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: p990805@gmail.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
kubectl apply -f cluster-issuer.yaml

```

### 7. 마이크로서비스 네임스페이스 생성

```bash
# 마이크로서비스 네임스페이스 생성
kubectl create namespace msa-system
kubectl create namespace user-service
kubectl create namespace lucky-service
kubectl create namespace gateway-service
kubectl create namespace eureka-service
kubectl create namespace diary-service
kubectl create namespace config-service
kubectl create namespace frontend-service

```

## 남은 작업

1. 각 마이크로서비스의 Dockerfile 작성
2. 각 마이크로서비스 Docker 이미지 빌드 및 Docker Hub에 푸시
3. 각 마이크로서비스의 Deployment, Service, Ingress 설정 및 배포
4. 전체 시스템 연동 테스트

## 프로젝트 구성

### 마이크로서비스 구성

- Config Service: 중앙 설정 관리 (Spring Cloud Config)
- Eureka Service: 서비스 디스커버리
- Gateway Service: API 게이트웨이
- User Service: 사용자 관리
- Diary Service: 다이어리 기능
- Lucky Service: 운세 서비스
- Frontend Service: React 기반 프론트엔드

### 프로젝트 폴더 구조

```
project-root/
│
├── BE/
│   ├── config-service/
│   │   ├── src/
│   │   ├── Dockerfile  # 아직 작성 필요
│   │   └── pom.xml
│   │
│   ├── eureka-service/
│   │   ├── src/
│   │   ├── Dockerfile  # 아직 작성 필요
│   │   └── pom.xml
│   │
│   ├── gateway-service/
│   │   ├── src/
│   │   ├── Dockerfile  # 아직 작성 필요
│   │   └── pom.xml
│   │
│   ├── user-service/
│   │   ├── src/
│   │   ├── Dockerfile  # 아직 작성 필요
│   │   └── pom.xml
│   │
│   ├── diary-service/
│   │   ├── src/
│   │   ├── Dockerfile  # 아직 작성 필요
│   │   └── pom.xml
│   │
│   └── lucky-service/
│       ├── src/
│       ├── Dockerfile  # 아직 작성 필요
│       └── pom.xml
│
└── FE/
    └── frontend-service/
        ├── src/
        ├── Dockerfile  # Frontend만 작성 완료
        └── package.json

```

</details>
