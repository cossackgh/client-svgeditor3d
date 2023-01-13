import type {
  DataInteractive,
  DataOptions,
  //MapTheme,
  BalloonTheme,
  LoadObject,
  OptionsExtrudeObject,
  //GroupSettings,
  //ParametersStart,
  TextOptions,
  OptionsAnimationStep,
} from "./models/simple.models";
//import { SvgMap } from './_privatemodule/svg'
import Base from "./base";
//import { Scene } from "three";
import * as THREE from "three";
import { SVGLoader } from "./SVGLoader";
import { OBJLoader } from "./OBJLoader";
import { MTLLoader } from "./MTLLoader";
import { GLTFLoader } from "./GLTFLoader.js";
import { DRACOLoader } from "./DRACOLoader.js";
import { TextGeometry } from "./TextGeometry.js";
import { FontLoader } from "./FontLoader.js";
import { TTFLoader } from "./TTFLoader.js";
import { createMultiMaterialObject } from "./SceneUtils.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import { OutlineEffect } from "three/addons/effects/OutlineEffect.js";
import { EffectComposer } from "./EffectComposer.js";
import { RenderPass } from "./RenderPass.js";
import { ShaderPass } from "./ShaderPass.js";
import { OutlinePass } from "./OutlinePass.js";
import { FXAAShader } from "./FXAAShader.js";

import { OutlineEffect } from "./OutlineEffect.js";

export class ClientSVG3D extends Base {
  node: HTMLElement;
  dataItems: DataInteractive[] = [];
  options: DataOptions = {
    title: "",
    urlmap: "",
    stringSVG: "",
    interactiveLayer: "#interactive",
    isRemoveUnuseItem: false,
    isHoverEnable: true,
    funcParams: {},
    paramsMap: {
      positions: new THREE.Vector3(),
      rotations: new THREE.Vector3(),
      scales: new THREE.Vector3(),
    },
  };

  balloonTheme: BalloonTheme = {
    colorBG: "#ffffff",
    colorTitle: "#ff0000",
    colorDescription: "#34f05a",
    isPositionFixed: true,
    top: 10,
    left: 20,
  };

  isMobile: boolean | undefined;

  static evCache: unknown[] | undefined;
  static prevDiff = -1;
  static scrollEvent: unknown;
  static selectItem: unknown;
  static hoverCurrentItem: any | undefined;
  // eslint-disable-next-line prettier/prettier
  static hoverPrevItem: any 
    | undefined;
  currentZoom = 1;
  static INTERSECTED: any;
  static scene = new THREE.Scene();
  public scenePublic = ClientSVG3D.scene;
  static renderer: THREE.WebGLRenderer;
  static helper1: THREE.GridHelper;
  static helper2: THREE.GridHelper;
  static helper3: THREE.GridHelper;
  static spotlight: THREE.SpotLight;
  static camera = new THREE.PerspectiveCamera();
  static cameraOrtho = new THREE.PerspectiveCamera();
  static raycaster = new THREE.Raycaster();
  static pointer = new THREE.Vector2();
  static controls: OrbitControls;
  static mouse = {
    x: 0,
    y: 0,
  };
  static nodeMap: HTMLElement;
  static mixer: THREE.AnimationMixer;
  static clock = new THREE.Clock();
  static loadObject = new THREE.Object3D();
  static rootMap = new THREE.Group();
  static groupObjects = new THREE.Group();
  static groupActive = new THREE.Group();
  static groupSVGExtrude = new THREE.Group();
  static groupTexts = new THREE.Group();
  static outlinePass: OutlinePass;
  static effect: OutlineEffect;
  constructor(
    node: HTMLElement,
    dataItems: DataInteractive[],
    options: DataOptions,
    // isMobile: boolean,
    balloonTheme: BalloonTheme
  ) {
    console.log("Input NODE = ", node);
    super();
    this.balloonTheme = balloonTheme;
    this.node = node;
    this.dataItems = dataItems;

    if (balloonTheme !== undefined) {
      this.balloonTheme = balloonTheme;
    }

    if (options !== undefined) {
      //this.options = options

      if (options.title !== undefined) {
        this.options.title = options.title;
      }
      if (options.urlmap !== undefined) {
        this.options.urlmap = options.urlmap;
      }
      if (options.stringSVG !== undefined) {
        this.options.stringSVG = options.stringSVG;
      }
      if (options.paramsMap !== undefined) {
        this.options.paramsMap = options.paramsMap;
      }
      if (options.interactiveLayer !== undefined) {
        this.options.interactiveLayer = options.interactiveLayer;
      }
      if (options.isRemoveUnuseItem !== undefined) {
        this.options.isRemoveUnuseItem = options.isRemoveUnuseItem;
      }
      if (options.isHoverEnable !== undefined) {
        this.options.isHoverEnable = options.isHoverEnable;
      }
      if (options.funcClick !== undefined) {
        this.options.funcClick = options.funcClick;
      }
      if (options.funcParams !== undefined) {
        this.options.funcParams = options.funcParams;
      }
    }
  }
  static test(): boolean {
    return true;
  }

  /* 
  initTREE() {

  } */
  changeSceneBG(color: string): void {
    ClientSVG3D.scene.background = new THREE.Color(color);
  }

  init(): void {
    ClientSVG3D.rootMap.name = "rootMap";
    ClientSVG3D.rootMap.position.x = -1400;
    ClientSVG3D.rootMap.position.y = -650;
    ClientSVG3D.rootMap.position.z = 1;
    ClientSVG3D.rootMap.scale.set(1.0, 1.0, 1.0);
    ClientSVG3D.scene.add(ClientSVG3D.rootMap);

    ClientSVG3D.nodeMap = this.node;
    const container = this.node;
    if (ClientSVG3D.groupObjects.name === "") {
      ClientSVG3D.groupObjects.name = "objects";
    }
    if (ClientSVG3D.groupTexts.name === "") {
      ClientSVG3D.groupTexts.name = "text";
    }

    //this.changeSceneBG(this.options?.mapTheme?.colorBG?.toString() || "#000");
    ClientSVG3D.renderer?.render(ClientSVG3D.scene, ClientSVG3D.camera);
    ClientSVG3D.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    ClientSVG3D.renderer.setSize(container.clientWidth, container.clientHeight);
    //ClientSVG3D.renderer.shadowMap.type = THREE.BasicShadowMap;
    ClientSVG3D.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    ClientSVG3D.renderer.shadowMap.enabled = true;
    container.appendChild(ClientSVG3D.renderer.domElement);
    this.addCamera();
    this.addLight();
    this.addPlane();
    //this.addHelpers(true, false, false);
    //this.addExample();
    /*     this.addGLB({
      urlOBJ: "./public/3dobj/scene.glb",
      //urlMTL: "./public/3dobj/car-1.mtl",
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      scale: { x: 0.1, y: 0.1, z: 0.1 },
      position: { x: -400, y: -220, z: 2 },
    });
    this.addObject({
      urlOBJ: "./public/3dobj/obj/cafe.obj",
      urlMTL: "./public/3dobj/obj/cafe.mtl",
      rotation: { x: Math.PI / 2, y: Math.PI / 2, z: 0 },
      scale: { x: 50.003, y: 50.003, z: 50.003 },
      position: { x: -460, y: -30, z: 0 },
      group: new THREE.Group(),
    }); */
    this.addSVGExtrudeObject({
      groupObjects: new THREE.Group(),
      settingsGroup: {
        nameGroup: "active",
        positions: this.options.paramsMap?.positions,
        scales: this.options.paramsMap?.scales,
      },
      nameLayerSVG: this.options.interactiveLayer,
      settingsExtrude: {
        depth: 6,
        bevelEnabled: false,
      },
      material: new THREE.MeshPhongMaterial({
        color: 0x111111,
        specular: 0x666666,
        emissive: 0x777777,
        shininess: 6,
        opacity: 0.9,
        transparent: false,
        wireframe: false,
      }),
      shadow: {
        castShadow: true,
        receiveShadow: false,
      },
    });

    this.addControls(true, true, false);

    //Postprocessing
    /*     const composer = new EffectComposer(ClientSVG3D.renderer);

    const renderPass = new RenderPass(ClientSVG3D.scene, ClientSVG3D.camera);
    composer.addPass(renderPass);

    ClientSVG3D.outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      ClientSVG3D.scene,
      ClientSVG3D.camera
    );
    composer.addPass(ClientSVG3D.outlinePass);
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    composer.addPass(effectFXAA);
    ClientSVG3D.outlinePass.edgeStrength = 4;
    ClientSVG3D.outlinePass.edgeGlow = 0.75;
    ClientSVG3D.outlinePass.edgeThickness = 8;
    ClientSVG3D.outlinePass.pulsePeriod = 6;
    ClientSVG3D.outlinePass.visibleEdgeColor.set("#006834");
    ClientSVG3D.outlinePass.hiddenEdgeColor.set("#190a05"); */
    /* ClientSVG3D.effect = new OutlineEffect(ClientSVG3D.renderer);
    new OutlineEffect(ClientSVG3D.renderer, {
      defaultThickness: 0.01,
      defaultColor: [34, 0, 0],
      defaultAlpha: 0.8,
      defaultKeepAlive: true, // keeps outline material in cache even if material is removed from scene
    }); */
  }
  addCamera(): void {
    ClientSVG3D.camera.fov = 55;
    ClientSVG3D.camera.aspect = window.innerWidth / window.innerHeight;
    ClientSVG3D.camera.near = 1;
    ClientSVG3D.camera.far = 2000;
    ClientSVG3D.camera.zoom = 1.0;
    //ClientSVG3D.camera.position.set(0, -1500, 2000); // Set position like this
    ClientSVG3D.camera.position.set(0, -1500, 0); // Set position like this
    ClientSVG3D.renderer.render(ClientSVG3D.scene, ClientSVG3D.camera);
    //ClientSVG3D.scene.add(ClientSVG3D.camera);
    ClientSVG3D.camera.updateProjectionMatrix();
  }
  addLight(): void {
    const ambiLight = new THREE.AmbientLight(0xffffff, 0.8);
    ambiLight.name = "AmbientLight";
    ClientSVG3D.scene.add(ambiLight);
    const targetObject = new THREE.Object3D();
    targetObject.name = "TargetSpotLight";

    ClientSVG3D.spotlight = new THREE.SpotLight(0xffffff, 0.3);
    ClientSVG3D.spotlight.name = "SpotLight";
    ClientSVG3D.spotlight.position.set(20, 200, 1800);
    ClientSVG3D.spotlight.angle = -Math.PI * 0.3;
    ClientSVG3D.spotlight.castShadow = true;
    //light.penumbra = 0.3;
    ClientSVG3D.spotlight.shadow.camera.near = 30;
    ClientSVG3D.spotlight.shadow.camera.far = 200000;
    //ClientSVG3D.spotlight.shadow.bias = 0.000222;
    ClientSVG3D.spotlight.shadow.bias = 0.0;
    ClientSVG3D.spotlight.shadow.mapSize.width = 2048;
    ClientSVG3D.spotlight.shadow.mapSize.height = 2048;
    ClientSVG3D.spotlight.shadow.radius = 2.8;
    ClientSVG3D.scene.add(targetObject);
    targetObject.position.set(-60, -100, -300);
    ClientSVG3D.spotlight.target = targetObject;
    const lightHelper1 = new THREE.SpotLightHelper(ClientSVG3D.spotlight);
    ClientSVG3D.scene.add(ClientSVG3D.spotlight);
    //ClientSVG3D.scene.add(lightHelper1);
  }
  addPlane(): void {
    const materialShadow = new THREE.ShadowMaterial();
    materialShadow.opacity = 0.3;
    materialShadow.color = new THREE.Color(0x000000);
    const materialPlane = new THREE.MeshPhongMaterial({
      color: 0xff1111,
      specular: 0x666666,
      emissive: 0x003333,
      shininess: 6,
      opacity: 0.7,
      transparent: true,
    });
    const geometry = new THREE.PlaneGeometry(3000, 3000, 30, 30);
    //geometry.rotateX(-Math.PI / 0.001);
    const plane = new THREE.Mesh(geometry, materialShadow);
    plane.name = "plane";
    plane.position.z = 0;
    plane.castShadow = true;
    plane.receiveShadow = true;
    ClientSVG3D.scene.add(plane);
  }
  addHelpers(x: boolean, y: boolean, z: boolean): void {
    if (x) {
      ClientSVG3D.helper1 = new THREE.GridHelper(1600, 30, 0x0000ff, 0x808080);
      ClientSVG3D.helper1.rotation.x = Math.PI / 2;
      ClientSVG3D.helper1.name = "helperX";
      ClientSVG3D.scene.add(ClientSVG3D.helper1);
    }
    if (y) {
      ClientSVG3D.helper2 = new THREE.GridHelper(1600, 30, 0x0000ff, 0x808080);
      ClientSVG3D.helper2.rotation.y = Math.PI / 2;
      ClientSVG3D.helper2.name = "helperY";
      ClientSVG3D.scene.add(ClientSVG3D.helper2);
    }
    if (z) {
      ClientSVG3D.helper3 = new THREE.GridHelper(600, 30, 0x0000ff, 0x808080);
      ClientSVG3D.helper3.rotation.z = Math.PI / 2;
      ClientSVG3D.helper3.name = "helperZ";
      ClientSVG3D.scene.add(ClientSVG3D.helper3);
    }
    const axesHelper = new THREE.AxesHelper(100);
    axesHelper.name = "axesHelper";
    ClientSVG3D.scene.add(axesHelper);
  }
  addControls(isZoom: boolean, isPan: boolean, isRotate: boolean): void {
    ClientSVG3D.controls = new OrbitControls(
      ClientSVG3D.camera,
      ClientSVG3D.renderer.domElement
    );

    ClientSVG3D.controls.addEventListener("change", this.renderEventControl);
    ClientSVG3D.controls.screenSpacePanning = false;
    ClientSVG3D.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    ClientSVG3D.controls.dampingFactor = 0.05;

    ClientSVG3D.controls.enablePan = isPan;
    ClientSVG3D.controls.enableZoom = isZoom;
    ClientSVG3D.controls.enableRotate = isRotate;
    ClientSVG3D.controls.screenSpacePanning = true;

    ClientSVG3D.controls.minDistance = 1500;
    ClientSVG3D.controls.maxDistance = 3000;

    ClientSVG3D.controls.minPolarAngle = Math.PI / 2;
    ClientSVG3D.controls.maxPolarAngle = Math.PI / 1.2;
    ClientSVG3D.controls.maxAzimuthAngle = Math.PI;
    ClientSVG3D.controls.target = new THREE.Vector3(0, 1230, -620);
    ClientSVG3D.controls.update();
  }
  addExample(): void {
    const geometry = new THREE.BoxGeometry(60, 60, 60);
    const colors = new Uint8Array(25);
    const format = ClientSVG3D.renderer.capabilities.isWebGL2
      ? THREE.RedFormat
      : THREE.LuminanceFormat;
    for (let c = 0; c <= colors.length; c++) {
      colors[c] = (c / colors.length) * 256;
    }
    const gradientMap = new THREE.DataTexture(colors, 20, 1, format);
    gradientMap.needsUpdate = true;
    const diffuseColor = new THREE.Color()
      .setHSL(0.8, 0.5, 0.72)
      .multiplyScalar(0.65);

    const materialToon = new THREE.MeshToonMaterial({
      color: diffuseColor,
      gradientMap: gradientMap,
    });
    const cube = new THREE.Mesh(geometry, materialToon);
    cube.position.set(0, 0, 60);
    cube.castShadow = true;
    ClientSVG3D.scene.add(cube);
    const sphereGeometry = new THREE.SphereGeometry(40, 20, 20);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: "rgb(55,155,155)",
      emissive: 0x222222,
    });
    const sphere = new THREE.Mesh(sphereGeometry, materialToon);
    sphere.position.set(0, 0, 40);
    sphere.castShadow = true;
    ClientSVG3D.scene.add(sphere);
  }
  async addGLB(options: LoadObject): Promise<void> {
    const classOptions = this.options;

    const dracoLoader = new DRACOLoader();
    ClientSVG3D.groupObjects.position.set(
      options.positionGroup?.x as number,
      options.positionGroup?.y as number,
      options.positionGroup?.z as number
    );
    ClientSVG3D.groupObjects.rotation.set(
      options.rotationGroup?.x as number,
      options.rotationGroup?.y as number,
      options.rotationGroup?.z as number
    );
    ClientSVG3D.groupObjects.scale.set(
      options.scaleGroup?.x as number,
      options.scaleGroup?.y as number,
      options.scaleGroup?.z as number
    );

    console.log(" ### ==== #### addGLB options = > ", options);
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      options.urlOBJ,
      function (gltf: { scene: any; animations: any[] }) {
        const model = gltf.scene;
        model.rotation.x = options.rotation?.x;
        model.rotation.y = options.rotation?.y;
        model.rotation.z = options.rotation?.z;
        model.scale.set(options.scale?.x, options.scale?.y, options.scale?.z);
        model.position.set(
          options.position?.x,
          options.position?.y,
          options.position?.z
        );
        model.castShadow = true;
        model.receiveShadow = false;
        const animations = gltf.animations;
        console.log(" ### ==== #### addGLB gltf = > ", gltf);
        console.log(" ### ==== #### addGLB model = > ", model);
        ClientSVG3D.mixer = new THREE.AnimationMixer(model);
        for (let idxAnim = 0; idxAnim < animations.length; idxAnim++) {
          const element = animations[idxAnim];
          console.log(" ### ==== #### addGLB element = > ", element);
          const action = ClientSVG3D.mixer.clipAction(element);
          console.log(" ### ==== #### addGLB action = > ", action);
          action.play();
        }
        console.log(" ### ==== #### addGLB mixer = > ", ClientSVG3D.mixer);

        //ClientSVG3D.mixer.clipAction(gltf.animations[0]).play();

        ClientSVG3D.groupObjects.add(model);

        ClientSVG3D.rootMap.add(ClientSVG3D.groupObjects);
        //ClientSVG3D.scene.add(ClientSVG3D.groupObjects);
        ClientSVG3D.render();
      },
      undefined,
      function (e: any) {
        console.error(e);
      }
    );
  }
  addText(optionsText: TextOptions): void {
    const loader = new FontLoader();
    loader.load("./public/fonts/Roboto_Bold.json", function (response: any) {
      const font = response;
      //console.log(" ### ==== #### addText font = > ", font);
      const textGeo = new TextGeometry(optionsText.text, {
        font: font,
        size: optionsText.size,
        height: 4,
        /*       curveSegments: curveSegments,
      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelEnabled: bevelEnabled */
      });

      textGeo.computeBoundingBox();
      textGeo.computeVertexNormals();
      const materialText = new THREE.MeshPhongMaterial({
        color: optionsText.color,
        specular: 0x333333,
        emissive: 0x555555,
        shininess: 5,
        opacity: 0.9,
        transparent: false,
        wireframe: false,
      });
      const centerOffset =
        textGeo.boundingBox !== null
          ? -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
          : 0;

      //console.log(" ### ==== #### addText centerOffset = > ", centerOffset);
      const textMesh1 = new THREE.Mesh(textGeo, materialText);

      textMesh1.position.x = centerOffset + (optionsText.position?.x as number);
      textMesh1.position.y = optionsText.position?.y as number;
      textMesh1.position.z = optionsText.position?.z as number;

      textMesh1.rotation.x = optionsText.rotation?.x as number;
      textMesh1.rotation.y = optionsText.rotation?.y as number;
      textMesh1.rotation.z = optionsText.rotation?.z as number;
      textMesh1.castShadow = optionsText.shadow?.castShadow as boolean;
      textMesh1.receiveShadow = optionsText.shadow?.receiveShadow as boolean;
      //console.log(" ### ==== #### addText textMesh1 = > ", textMesh1);

      ClientSVG3D.groupTexts.add(textMesh1);
      ClientSVG3D.rootMap.add(ClientSVG3D.groupTexts);
      //ClientSVG3D.scene.add(ClientSVG3D.groupTexts);
      ClientSVG3D.render();
      /* console.log(
        " ### ==== #### addText tetxtGroup = > ",
        ClientSVG3D.groupTexts
      ); */
    });
  }
  addTextToSVGPoint(optionsText: TextOptions, idPoint: string): void {
    const classOptions = this.options;
    const manager = new THREE.LoadingManager();
    const loaderSVG = new SVGLoader(manager);

    loaderSVG.load(
      classOptions.urlmap,
      (data: { paths: any }) => {
        const paths = data.paths;
        //console.log("    ## addTextToSVGPoint paths => ", data);
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          const simpleShapes = SVGLoader.createShapes(path);
          for (let j = 0; j < simpleShapes.length; j++) {
            const simpleShape = simpleShapes[j];
            const shape3d = new THREE.ExtrudeGeometry(simpleShape, {
              depth: 50,
              bevelEnabled: false,
            });
            if (path.userData.node.nodeName === "circle") {
              /*console.log(
                "    ## addTextToSVGPoint path.userData.node.parentNode.id => ",
                path.userData.node.attributes.cx.value
              );
              console.log("    ## addTextToSVGPoint idPoint => ", idPoint); */
              if (path.userData.node.id === idPoint) {
                /* console.log("    ## simpleShapes => ", simpleShapes);
                console.log("    ## shape3d => ", shape3d); */
                const mesh = new THREE.Mesh(
                  shape3d,
                  new THREE.MeshPhongMaterial({
                    color: 0x111111,
                    specular: 0x666666,
                    emissive: 0x777777,
                    shininess: 6,
                    opacity: 0.9,
                    transparent: false,
                    wireframe: false,
                  })
                );

                //ClientSVG3D.groupActive.add(mesh);
                //ClientSVG3D.rootMap.add(ClientSVG3D.groupActive);
                this.addText({
                  text: optionsText.text,
                  color: optionsText.color,
                  size: optionsText.size,
                  position: new THREE.Vector3(
                    Number(path.userData.node.attributes.cx.value),
                    Number(path.userData.node.attributes.cy.value),
                    optionsText.position?.z
                  ),
                  rotation: optionsText.rotation,
                  scale: optionsText.scale,
                  font: optionsText.font,
                  isAnimation: optionsText.isAnimation,
                  isLoopAnimation: optionsText.isLoopAnimation,
                  pathAnimation: optionsText.pathAnimation,
                  shadow: optionsText.shadow,
                });
              }
            }
          }
        }
        ClientSVG3D.rootMap.add(ClientSVG3D.groupActive);
        //ClientSVG3D.scene.add(ClientSVG3D.rootMap);
        ClientSVG3D.render();
      },
      function (xhr: { loaded: number; total: number }) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded SHOPS");
      },
      function (error: any) {
        console.log("An error happened", error);
      }
    );
  }

  async addObject(options: LoadObject): Promise<any> {
    const classOptions = this.options;
    const manager = new THREE.LoadingManager();
    const loaderOBJ = new OBJLoader(manager);
    const loaderMTL = new MTLLoader(manager).setMaterialOptions({
      invertTrProperty: false,
    });

    console.log(" ### ==== #### addObjects options = > ", options);
    if (options.urlMTL !== undefined) {
      loaderMTL.load(
        options.urlMTL,
        (materialsCar: { preload: () => void }) => {
          materialsCar.preload();
          loaderOBJ.setMaterials(materialsCar).load(
            options.urlOBJ,
            (object: THREE.Object3D<THREE.Event>) => {
              object.traverse((child: any) => {
                /*console.log(
                  " ### ==== #### addObjects load OBJ With Material = > ",
                  child
                );
                 console.log(
                  " ### ==== #### addObjects materialsCar = > ",
                  materialsCar
                ); */
                if (child.isLineSegments) {
                  console.log(
                    " ### ==== #### addObjects load OBJ isLineSegments = > ",
                    child
                  );
                  if (child.isConditionalLine) {
                    child.visible = true;
                  }
                }
                if ((child as THREE.Mesh).material) {
                  child.rotation.x = options.rotation?.x;
                  child.rotation.y = options.rotation?.y;
                  child.rotation.z = options.rotation?.z;
                  child.scale.set(
                    options.scale?.x,
                    options.scale?.y,
                    options.scale?.z
                  );
                  child.position.set(
                    options.position?.x,
                    options.position?.y,
                    options.position?.z
                  );
                  child.castShadow = true;
                  child.receiveShadow = false;
                }
              });
              if (options.isAnimation) {
                console.log(
                  " ### ==== #### addObjects load OBJ isAnimation = > ",
                  object
                );
                /*this.addAnimation(object, {
                  //object: object,
                }); */
              }
              ClientSVG3D.groupObjects.add(object);
              ClientSVG3D.rootMap.add(ClientSVG3D.groupObjects);
              ClientSVG3D.render();
              //console.log("ADD OBJECT SCENE = ", ClientSVG3D.scene);
              return object;
            },
            this.onProgress,
            this.onError
          );
        },
        this.onProgress,
        this.onError
      );
    } else {
      loaderOBJ.load(
        options.urlOBJ,
        (object: THREE.Object3D<THREE.Event>) => {
          //return object;
          object.traverse((child: any) => {
            console.log(" ### ==== #### load OBJ = > ", child);
            if ((child as THREE.Mesh).material) {
              child.rotation.x = options.rotation?.x;
              child.rotation.y = options.rotation?.y;
              child.rotation.z = options.rotation?.z;
              child.scale.set(
                options.scale?.x,
                options.scale?.y,
                options.scale?.z
              );
              child.position.set(
                options.position?.x,
                options.position?.y,
                options.position?.z
              );
              child.material.color = new THREE.Color(options.color);
              child.material.transparent = true;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          if (options.isAnimation) {
            console.log(
              " ### ==== #### addObjects load OBJ isAnimation = > ",
              object
            );
            /* this.addAnimation(object.children[0], {
              //object: object.children[0],
            }); */
          }
          /* ClientSVG3D.groupObjects.add(object);
          ClientSVG3D.rootMap.add(ClientSVG3D.groupObjects);
          ClientSVG3D.render(); */
          console.log("SCENE LOAD OBJECT = ", object);
          console.log("SCENE LOAD OBJECT = ", ClientSVG3D.scene);
          ClientSVG3D.loadObject = object;
        },
        this.onProgress,
        this.onError
      );
      const ol = await loaderOBJ
        .loadAsync(options.urlOBJ)
        .then((object: THREE.Object3D<THREE.Event>) => {
          //return object;
          object.traverse((child: any) => {
            console.log(" ### ==== #### ASYNC load OBJ = > ", child);
            if ((child as THREE.Mesh).material) {
              child.rotation.x = options.rotation?.x;
              child.rotation.y = options.rotation?.y;
              child.rotation.z = options.rotation?.z;
              child.scale.set(
                options.scale?.x,
                options.scale?.y,
                options.scale?.z
              );
              child.position.set(
                options.position?.x,
                options.position?.y,
                options.position?.z
              );
              child.material.color = new THREE.Color(options.color);
              child.material.transparent = true;
              child.castShadow = true;
              child.receiveShadow = true;
            }
            ClientSVG3D.groupObjects.add(object);
            ClientSVG3D.rootMap.add(ClientSVG3D.groupObjects);
            ClientSVG3D.render();
            console.log("SCENE LOAD OBJECT = ", object);
            console.log("SCENE LOAD OBJECT = ", ClientSVG3D.scene);
          });
          return object;
        })
        .catch((error) => {
          console.log(" ### ==== #### load OBJ error = > ", error);
        });
      console.log(" ### ==== #### RETURN loadOBJ = > ", ol);
      return ol;
    }
  }
  addAnimation(object: any, options: OptionsAnimationStep): void {
    console.log(" ### ==== #### addAnimation options = > ", options);
    // POSITION
    const positionKF = new THREE.VectorKeyframeTrack(
      ".position",
      options.positionKeys !== undefined
        ? [...options.positionKeys]
        : [0, 1, 2],
      options.positionSteps !== undefined
        ? [...options.positionSteps]
        : [0, 0, 0, 100, 0, 0, 200, 0, 0]
    );

    // SCALE
    const scaleKF = new THREE.VectorKeyframeTrack(
      ".scale",
      options.scaleKeys !== undefined ? [...options.scaleKeys] : [0, 1, 2],
      options.scaleSteps !== undefined ? [...options.scaleSteps] : [1, 1, 1]
    );

    // ROTATION
    // Rotation should be performed using quaternions, using a THREE.QuaternionKeyframeTrack
    // Interpolating Euler angles (.rotation property) can be problematic and is currently not supported

    // set up rotation about x axis
    const xAxis = new THREE.Vector3(0, 0, 0);

    const qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
    const qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI);
    const quaternionKF = new THREE.QuaternionKeyframeTrack(
      ".quaternion",
      [0, 1, 2, 3, 4, 5],
      [
        qInitial.x,
        qInitial.y,
        qInitial.z,
        qInitial.w,
        qFinal.x,
        qFinal.y,
        qFinal.z,
        qFinal.w,
        qInitial.x,
        qInitial.y,
        qInitial.z,
        qInitial.w,
      ]
    );

    // COLOR
    const colorKF = new THREE.ColorKeyframeTrack(
      ".material.color",
      options.colorKeys !== undefined ? [...options.colorKeys] : [0, 1, 2],
      options.colorSteps !== undefined
        ? [...options.colorSteps]
        : [1, 0, 0, 0, 1, 0, 0, 0, 1],
      THREE.InterpolateDiscrete
    );

    // OPACITY
    const opacityKF = new THREE.NumberKeyframeTrack(
      ".material.opacity",
      options.opacityKeys !== undefined ? [...options.opacityKeys] : [0, 1, 2],
      options.opacitySteps !== undefined ? [...options.opacitySteps] : [0, 1, 0]
    );
    console.log("options ==<>== ", options);
    console.log("positionKF ==<>== ", positionKF);
    // create an animation sequence with the tracks
    // If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
    const clip = new THREE.AnimationClip(
      "Action",
      options.numberOfSteps !== undefined ? options.numberOfSteps : 3,
      [
        //scaleKF,
        positionKF,
        //quaternionKF,
        //colorKF,
        opacityKF,
      ]
    );

    // setup the THREE.AnimationMixer
    ClientSVG3D.mixer = new THREE.AnimationMixer(object);
    console.log(" ### ==== #### addAnimation MIXER = > ", ClientSVG3D.mixer);
    // create a ClipAction and set it to play
    const clipAction = ClientSVG3D.mixer.clipAction(clip);
    clipAction.play();
  }
  async addSVGExtrudeObject(options: OptionsExtrudeObject): Promise<void> {
    const classOptions = this.options;
    const manager = new THREE.LoadingManager();
    const loaderSVG = new SVGLoader(manager);
    const groupSVGExtrude = new THREE.Group();
    console.log(" ### ==== #### addSVGExtrudeObject loaderSVG = > ", loaderSVG);
    groupSVGExtrude.name = options.settingsGroup?.nameGroup as string;
    groupSVGExtrude.position.z = options.settingsGroup?.positions?.z as number;
    /*groupSVGExtrude.position.set(
      options.settingsGroup?.positions?.x as number,
      options.settingsGroup?.positions?.y as number,
      options.settingsGroup?.positions?.z as number
    );
    groupSVGExtrude.scale.set(
      options.settingsGroup?.scales?.x as number,
      options.settingsGroup?.scales?.y as number,
      options.settingsGroup?.scales?.z as number
    ); */
    loaderSVG.load(
      classOptions.urlmap,
      (data: { paths: any }) => {
        const paths = data.paths;
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          const simpleShapes = SVGLoader.createShapes(path);
          for (let j = 0; j < simpleShapes.length; j++) {
            if (path.userData.node.parentNode.id === options.nameLayerSVG) {
              /* console.log(
                "    ## paths options.nameLayerSVG => ",
                options.nameLayerSVG
              );
              console.log("    ## paths => ", path.userData.node.parentNode.id); */
              const simpleShape = simpleShapes[j];
              const shape3d = new THREE.ExtrudeGeometry(
                simpleShape,
                options.settingsExtrude
              );
              /*               if (options.material !== undefined) {
                options.material.userData.outlineParameters = {
                  thickness: 0.001,
                  color: [54, 0, 0],
                  alpha: 0.8,
                  visible: true,
                  keepAlive: false,
                };
              } */

              const mesh = new THREE.Mesh(shape3d, options.material);
              mesh.castShadow = options.shadow?.castShadow as boolean;
              mesh.receiveShadow = options.shadow?.receiveShadow as boolean;
              mesh.name = path.userData.node.id;
              groupSVGExtrude.add(mesh);
            }
          }
        }
        ClientSVG3D.rootMap.add(groupSVGExtrude);
        ClientSVG3D.render();
      },
      function (xhr: { loaded: number; total: number }) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded SHOPS");
      },
      function (error: any) {
        console.log("An error happened", error);
      }
    );
  }

  onProgress(xhr: { loaded: number; total: number }) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded ALL");
    //return "OK";
  }
  onError(error: any) {
    console.log("An error happened", error);
  }
  selectItem(item: string): void {
    console.log("selectItem => ", item);
    this.clearColorActive();
    const id = item;
    const group = ClientSVG3D.scene.getObjectByName("active");
    if (group) {
      const mesh = group.getObjectByName(id);
      if (mesh) {
        (mesh as THREE.Mesh).material = new THREE.MeshPhongMaterial({
          color: 0xff1111,
          specular: 0x666666,
          emissive: 0x003333,
          shininess: 6,
          opacity: 1.0,
          transparent: false,
          wireframe: false,
        });
        mesh.scale.z = 1.5;
        console.log("mesh => ", mesh);
        ClientSVG3D.render();
      }
    }
  }

  start(): void {
    console.log("start  ClientSVG3D", ClientSVG3D.nodeMap);
    //this.clearThree(ClientSVG3D.scene);
    this.init();
    ClientSVG3D.animate();
    window.addEventListener("resize", this.onWindowResize);
    //document.addEventListener("mousemove", ClientSVG3D.myMouseMove);
    this.node.addEventListener(
      "mousemove",
      ClientSVG3D.onDocumentMouseMove,
      false
    );
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static onDocumentMouseMove(event: {
    offsetX: number;
    offsetY: number;
    screenX: number;
    screenY: number;
    clientX: number;
    clientY: number;
  }) {
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    //event.preventDefault();
    //console.log("mouse move");
    // update the mouse variable
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const container = ClientSVG3D.nodeMap;
    /* console.log("container => ", container);
        console.log("event.clientX => ", event.clientX);
    console.log("event.screenX => ", event.screenX);
    console.log("event.clientY => ", event.clientY);
    console.log("this.node.clientWidth => ", container.clientWidth);
    console.log("self.innerWidth => ", self.innerWidth);
    console.log("window.innerHeight => ", window.innerHeight); */

    ClientSVG3D.mouse.x =
      ((event.clientX - container?.offsetLeft + 0) / container?.offsetWidth) *
        2 -
      1;
    ClientSVG3D.mouse.y =
      -((event.offsetY + 0) / container?.offsetHeight) * 2 + 1;

    ClientSVG3D.raycaster.setFromCamera(
      ClientSVG3D.pointer,
      ClientSVG3D.camera
    );
    const vector = new THREE.Vector3(
      ClientSVG3D.mouse.x,
      ClientSVG3D.mouse.y,
      1
    );
    vector.unproject(ClientSVG3D.camera);
    const ray = new THREE.Raycaster(
      ClientSVG3D.camera.position,
      vector.sub(ClientSVG3D.camera.position).normalize()
    );

    const groupActive = ClientSVG3D.scene.getObjectByName("active");
    //console.log("groupActive = ", groupActive?.children);
    //console.log("ClientSVG3D.scene.children = ", ClientSVG3D.scene.children);
    const intersects = ray.intersectObjects(groupActive!.children, true);

    /* console.log("ClientSVG3D.INTERSECTED = ", ClientSVG3D.INTERSECTED); */
    if (intersects.length > 0) {
      //console.log("intersects = ", intersects);
      ClientSVG3D.hoverCurrentItem = intersects[0];
      intersects[0].object.scale.z = 2.5;
      /*       ClientSVG3D.outlinePass.selectedObjects = intersects[0].object;
      console.log("    ## outlinePass => ", ClientSVG3D.outlinePass); */
      /*intersects[0].object.position.z = -30; */
      (intersects[0].object as THREE.Mesh).material =
        new THREE.MeshPhongMaterial({
          color: 0xff1111,
          specular: 0x666666,
          emissive: 0x003333,
          shininess: 6,
          opacity: 1.0,
          transparent: false,
          wireframe: false,
        });
      if (ClientSVG3D.INTERSECTED != intersects[0].object) {
        if (ClientSVG3D.INTERSECTED) {
          //console.log("MOUSE OUT");
          /*           ClientSVG3D.INTERSECTED.material.color = new THREE.Color(
            "rgb(150,67,150)"
          ); */
        }
        ClientSVG3D.INTERSECTED = intersects[0].object;
        console.log("MOUSE OVER", intersects[0].object.name);
        const groupActive = ClientSVG3D.scene.getObjectByName("active");
        groupActive?.children.forEach((element) => {
          (element as THREE.Mesh).material = new THREE.MeshPhongMaterial({
            color: 0x111111,
            specular: 0x666666,
            emissive: 0x777777,
            shininess: 6,
            opacity: 1.0,
            transparent: false,
            wireframe: false,
          });
          element.scale.z = 1;
          //intersects[0].object.position.z = 0;
        });
      }
    } else {
      /*  if (ClientSVG3D.INTERSECTED)
               ClientSVG3D.INTERSECTED.material.color =
          ClientSVG3D.INTERSECTED.currentHex; */

      const groupActive = ClientSVG3D.scene.getObjectByName("active");
      //console.log("MOUSE OUT", groupActive?.children);
      groupActive?.children.forEach((element) => {
        (element as THREE.Mesh).material = new THREE.MeshPhongMaterial({
          color: 0x111111,
          specular: 0x666666,
          emissive: 0x777777,
          shininess: 6,
          opacity: 1.0,
          transparent: true,
          wireframe: false,
        });
        element.scale.z = 1;
        //intersects[0].object.position.z = 0;
      });

      ClientSVG3D.INTERSECTED = null;
    }
    ClientSVG3D.render();
  }
  static render(): void {
    ClientSVG3D.renderer.render(ClientSVG3D.scene, ClientSVG3D.camera);
    const delta = ClientSVG3D.clock.getDelta();

    if (ClientSVG3D.mixer) {
      ClientSVG3D.mixer.update(delta);
    }
    //ClientSVG3D.effect.render(ClientSVG3D.scene, ClientSVG3D.camera);
    /* console.log("render");
    console.log("SCENE", ClientSVG3D.scene); */
    //throw new Error("Method not implemented.");
  }
  clearColorActive(): void {
    console.log("clearColorActive");
    const groupActive = ClientSVG3D.scene.getObjectByName("active");
    const materialClear = new THREE.MeshPhongMaterial({
      color: 0x111111,
      specular: 0x666666,
      emissive: 0x777777,
      shininess: 6,
      opacity: 1.0,
      transparent: true,
      wireframe: false,
    });
    materialClear.userData.outlineParameters = {
      thickness: 0.001,
      color: [54, 0, 0],
      alpha: 0.8,
      visible: true,
      keepAlive: false,
    };
    groupActive?.children.forEach((element) => {
      (element as THREE.Mesh).material = materialClear;

      element.scale.z = 1.0;
    });
    ClientSVG3D.render();
  }
  renderEventControl() {
    console.log("renderEventControl");
    ClientSVG3D.renderer?.render(ClientSVG3D.scene, ClientSVG3D.camera);
  }
  /*   static myMouseMove(ev: MouseEvent) {
    ev.preventDefault();

    ClientSVG3D.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    ClientSVG3D.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    throw new Error("Method not implemented.");
  } */

  async insertSVG(urlSVG: string) {
    this.node.innerHTML = "";

    const getSVGData = await loadSVGFile(urlSVG);
    // console.log("getSVGData = ", getSVGData);
  }
  clearThree(obj: any) {
    while (obj.children.length > 0) {
      this.clearThree(obj.children[0]);
      obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();

    if (obj.material) {
      //in case of map, bumpMap, normalMap, envMap ...
      Object.keys(obj.material).forEach((prop) => {
        if (!obj.material[prop]) return;
        if (
          obj.material[prop] !== null &&
          typeof obj.material[prop].dispose === "function"
        )
          obj.material[prop].dispose();
      });
      obj.material.dispose();
    }
  }
  onWindowResize() {
    ClientSVG3D.camera.aspect = window.innerWidth / window.innerHeight;
    ClientSVG3D.camera.updateProjectionMatrix();

    ClientSVG3D.renderer.setSize(window.innerWidth, window.innerHeight);
    ClientSVG3D.controls.update();
    ClientSVG3D.render();
  }

  /*   render() {
    ClientSVG3D.renderer.render(ClientSVG3D.scene, ClientSVG3D.camera);
    console.log("render");
  } */
  static animate() {
    console.log("animate");

    if (ClientSVG3D.mixer !== undefined)
      ClientSVG3D.mixer.update(ClientSVG3D.clock.getDelta());
    //requestAnimationFrame(ClientSVG3D.animate);
    ClientSVG3D.controls.update();
    ClientSVG3D.render();
  }
}

// create function load text file from url

const loadSVGFile = async (url: string) => {
  //  console.log('loadTextFromFile url = ', url)
  const data = fetch(url)
    .then((response) => response.text())
    .then((text) => {
      //  console.log('text = ', text)
      return text;
    })
    .catch((error) => {
      //  console.log('error = ', error)
      return error;
    });
  return data;
};

// write function chek  mobile device

const isMobile = () => {
  let check = false;
  ((a) => {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor);
  return check;
};
