import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ThreeModelComponent {
    constructor(parent) {
        this.parent = parent;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
    }

    getModelPath() {
        return './models/trophy.glb';
    }

    initThree() {
        this.parent.innerHTML = '';

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '280px';
        canvas.style.borderRadius = '10px';
        canvas.style.backgroundColor = '#1b3042';
        this.parent.appendChild(canvas);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1b3042);

        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        this.camera.position.set(2, 1.8, 2.5);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.setSize(this.parent.clientWidth, 280);

        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);

        const fillLight = new THREE.PointLight(0x4466cc, 0.5);
        fillLight.position.set(-2, 3, 4);
        this.scene.add(fillLight);

        const backLight = new THREE.PointLight(0xffaa66, 0.3);
        backLight.position.set(0, 2, -3);
        this.scene.add(backLight);

        const gridHelper = new THREE.GridHelper(4, 16, 0x88aaff, 0x335588);
        gridHelper.position.y = -0.8;
        this.scene.add(gridHelper);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = false;
        this.controls.enableZoom = true;
        this.controls.zoomSpeed = 0.8;
        this.controls.rotateSpeed = 0.8;

        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();

        window.addEventListener('resize', () => {
            if (this.parent.clientWidth > 0) {
                const width = this.parent.clientWidth;
                this.camera.aspect = width / 280;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(width, 280);
            }
        });
    }

    loadModel() {
        const loader = new GLTFLoader();
        const modelPath = this.getModelPath();

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-indicator';
        loadingDiv.style.position = 'absolute';
        loadingDiv.style.top = '50%';
        loadingDiv.style.left = '50%';
        loadingDiv.style.transform = 'translate(-50%, -50%)';
        loadingDiv.style.color = '#94a5bf';
        loadingDiv.style.fontSize = '12px';
        loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.6)';
        loadingDiv.style.padding = '6px 12px';
        loadingDiv.style.borderRadius = '20px';
        loadingDiv.textContent = 'Загрузка...';
        this.parent.style.position = 'relative';
        this.parent.appendChild(loadingDiv);

        loader.load(modelPath,
            (gltf) => {
                loadingDiv.remove();
                this.model = gltf.scene;

                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                this.model.position.x = -center.x;
                this.model.position.z = -center.z;
                this.model.position.y = -box.min.y;

                const maxDim = Math.max(size.x, size.y, size.z);
                if (maxDim > 1.8) {
                    const scale = 1.8 / maxDim;
                    this.model.scale.set(scale, scale, scale);
                }

                this.scene.add(this.model);
            },
            (xhr) => {
                const percent = Math.floor((xhr.loaded / xhr.total) * 100);
                loadingDiv.textContent = `Загрузка... ${percent}%`;
            },
            (error) => {
                console.error('Ошибка загрузки:', error);
                loadingDiv.textContent = 'Ошибка';
                loadingDiv.style.color = '#e74c3c';
                this.createFallbackModel();
                setTimeout(() => {
                    if (loadingDiv) loadingDiv.remove();
                }, 1500);
            }
        );
    }

    createFallbackModel() {
        const group = new THREE.Group();

        const geometry = new THREE.SphereGeometry(0.6, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0xffaa44, metalness: 0.7 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.y = 0.5;
        group.add(sphere);

        const ringGeometry = new THREE.TorusGeometry(0.8, 0.08, 32, 64);
        const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600, metalness: 0.8 });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.85;
        group.add(ring);

        const stemGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.4, 16);
        const stem = new THREE.Mesh(stemGeometry, material);
        stem.position.y = 0.2;
        group.add(stem);

        this.scene.add(group);
        this.model = group;
    }

    addControls() {
        const controlsDiv = document.createElement('div');
        controlsDiv.style.display = 'flex';
        controlsDiv.style.gap = '8px';
        controlsDiv.style.marginTop = '8px';
        controlsDiv.style.justifyContent = 'center';

        const resetBtn = document.createElement('button');
        resetBtn.textContent = '↺ Сброс';
        resetBtn.style.padding = '4px 10px';
        resetBtn.style.background = '#3577a0';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '4px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.style.fontSize = '11px';
        resetBtn.onclick = () => {
            this.camera.position.set(2, 1.8, 2.5);
            this.controls.target.set(0, 0.5, 0);
            this.controls.update();
        };

        const autoRotateBtn = document.createElement('button');
        autoRotateBtn.textContent = '↻ Вращать';
        autoRotateBtn.style.padding = '4px 10px';
        autoRotateBtn.style.background = '#3577a0';
        autoRotateBtn.style.color = 'white';
        autoRotateBtn.style.border = 'none';
        autoRotateBtn.style.borderRadius = '4px';
        autoRotateBtn.style.cursor = 'pointer';
        autoRotateBtn.style.fontSize = '11px';
        autoRotateBtn.onclick = () => {
            this.controls.autoRotate = !this.controls.autoRotate;
            autoRotateBtn.style.background = this.controls.autoRotate ? '#2ecc71' : '#3577a0';
            autoRotateBtn.textContent = this.controls.autoRotate ? '⏸ Стоп' : '↻ Вращать';
        };

        controlsDiv.appendChild(resetBtn);
        controlsDiv.appendChild(autoRotateBtn);
        this.parent.appendChild(controlsDiv);
    }

    render(participant) {
        this.initThree();
        this.loadModel();
        this.addControls();
    }
}
