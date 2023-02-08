/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  OptionsCam,
  OptionsSpotLight,
  OptionsAmbientLight,
  OptionsPlane,
  BoxParams,
  SphereParams,
  PolylineOptions,
} from "./models/simple.models";
//import { SvgMap } from './_privatemodule/svg'
import Base from "./base";
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
    isDebug: false,
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
  static DEBUG: boolean | undefined = false;
  static evCache: unknown[] | undefined;
  static prevDiff = -1;
  static scrollEvent: unknown;
  static selectItem: unknown;
  static hoverCurrentItem: any | undefined;
  static hoverPrevItem: any | undefined;
  currentZoom = 1;
  static INTERSECTED: any;
  static scene: THREE.Scene | null;
  public scenePublic: THREE.Scene | null | undefined;
  static renderer: THREE.WebGLRenderer | null;
  static helper1: THREE.GridHelper | null;
  static helper2: THREE.GridHelper | null;
  static helper3: THREE.GridHelper | null;
  static spotlight: THREE.SpotLight | null;
  static camera: THREE.PerspectiveCamera | null;
  static cameraOrtho: THREE.PerspectiveCamera | null =
    new THREE.PerspectiveCamera();
  static raycaster: THREE.Raycaster | null = new THREE.Raycaster();
  static pointer: THREE.Vector2 | null = new THREE.Vector2();
  static controls: OrbitControls | null;
  static mouse = {
    x: 0,
    y: 0,
  };
  static nodeMap: HTMLElement;
  static mixer: THREE.AnimationMixer | null;
  static clock: THREE.Clock | null = new THREE.Clock();
  static loadObject: THREE.Object3D | null = new THREE.Object3D();
  static rootMap: THREE.Group | null = new THREE.Group();
  static groupObjects: THREE.Group | null = new THREE.Group();
  static groupActive: THREE.Group | null = new THREE.Group();
  static groupSVGExtrude: THREE.Group | null = new THREE.Group();
  static groupTexts: THREE.Group | null = new THREE.Group();
  static outlinePass: OutlinePass | null;
  static effect: OutlineEffect | null;
  static place_1_call() {
    console.log("place to call");
    // throw new Error("Method not implemented.");
  }
  constructor(
    node: HTMLElement,
    dataItems: DataInteractive[],
    options: DataOptions,
    // isMobile: boolean,
    balloonTheme: BalloonTheme
  ) {
    super();
    this.balloonTheme = balloonTheme;
    this.node = node;
    this.dataItems = dataItems;

    if (balloonTheme !== undefined) {
      this.balloonTheme = balloonTheme;
    }

    if (options !== undefined) {
      //this.options = options
      if (options.isDebug !== undefined) {
        this.options.isDebug = options.isDebug;
        ClientSVG3D.DEBUG = options.isDebug;
      }
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ClientSVG3D.scene!.background = new THREE.Color(color);
  }

  init(): void {
    ClientSVG3D.rootMap!.name = "rootMap";
    ClientSVG3D.rootMap!.position.x = -1400;
    ClientSVG3D.rootMap!.position.y = -650;
    ClientSVG3D.rootMap!.position.z = 1;
    ClientSVG3D.rootMap!.scale.set(1.0, 1.0, 1.0);
    ClientSVG3D.scene?.add(ClientSVG3D.rootMap!);

    ClientSVG3D.nodeMap = this.node;
    const container = this.node;
    if (ClientSVG3D.groupObjects!.name === "") {
      ClientSVG3D.groupObjects!.name = "objects";
    }
    if (ClientSVG3D.groupTexts!.name === "") {
      ClientSVG3D.groupTexts!.name = "text";
    }

    //this.changeSceneBG(this.options?.mapTheme?.colorBG?.toString() || "#000");
    ClientSVG3D.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    ClientSVG3D.renderer.setSize(container.clientWidth, container.clientHeight);
    //ClientSVG3D.renderer.shadowMap.type = THREE.BasicShadowMap;
    ClientSVG3D.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    ClientSVG3D.renderer.shadowMap.enabled = true;
    container.appendChild(ClientSVG3D.renderer.domElement);
    console.log("ClientSVG3D.camera! #### ", ClientSVG3D.camera!);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ClientSVG3D.renderer.render(ClientSVG3D.scene!, ClientSVG3D.camera!);
    if (ClientSVG3D.DEBUG) console.log("container", container);
    if (ClientSVG3D.DEBUG)
      console.log("ClientSVG3D.renderer.", ClientSVG3D.renderer.domElement);
    /*let paramCam: OptionsCam | undefined;
    let paramAmbientLight: OptionsAmbientLight | undefined;
    let paramSpotLight: OptionsSpotLight | undefined;
    let paramPlane: OptionsPlane | undefined;
    this.addCamera(paramCam);
    this.addAmbientLight(paramAmbientLight);
    this.addSpotLight(paramSpotLight);
    this.addPlane(paramPlane); */

    /*this.addSVGExtrudeObject({
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
    }); */

    //this.addControls(true, true, false);

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
  addCamera(optionsCam: OptionsCam | undefined): void {
    ClientSVG3D.camera!.fov = optionsCam?.fov ?? 55;
    ClientSVG3D.camera!.aspect =
      optionsCam?.aspect ?? window.innerWidth / window.innerHeight;
    ClientSVG3D.camera!.near = optionsCam?.near ?? 1;
    ClientSVG3D.camera!.far = optionsCam?.far ?? 2000;
    ClientSVG3D.camera!.zoom = optionsCam?.zoom ?? 1.0;
    ClientSVG3D.camera!.position.set(
      optionsCam?.position?.x ?? 0,
      optionsCam?.position?.y ?? -1500,
      optionsCam?.position?.z ?? 0
    ); // Set position like this
    //ClientSVG3D.renderer.render(ClientSVG3D.scene, ClientSVG3D.camera);
    //ClientSVG3D.scene.add(ClientSVG3D.camera);
    ClientSVG3D.camera?.updateProjectionMatrix();
  }
  addAmbientLight(optionsAmbientLight: OptionsAmbientLight | undefined): void {
    const ambiLight = new THREE.AmbientLight(
      optionsAmbientLight?.color ?? 0xffffff,
      optionsAmbientLight?.intensity ?? 0.8
    );
    ambiLight.name = optionsAmbientLight?.name ?? "AmbientLight";
    ClientSVG3D.scene?.add(ambiLight);
  }
  addSpotLight(optionsSpotLight: OptionsSpotLight | undefined): void {
    const targetObject = new THREE.Object3D();
    targetObject.name = "TargetSpotLight";

    ClientSVG3D.spotlight = new THREE.SpotLight(
      optionsSpotLight?.color ?? 0xffffff,
      optionsSpotLight?.intensity ?? 0.3
    );
    ClientSVG3D.spotlight.name = optionsSpotLight?.name ?? "SpotLight";
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
    ClientSVG3D.scene?.add(targetObject);
    targetObject.position.set(-60, -100, -300);
    ClientSVG3D.spotlight.target = targetObject;
    const lightHelper1 = new THREE.SpotLightHelper(ClientSVG3D.spotlight);
    ClientSVG3D.scene?.add(ClientSVG3D.spotlight);
    //ClientSVG3D.scene.add(lightHelper1);
  }
  addPlane(optionsPlane: OptionsPlane | undefined): void {
    const materialShadow = optionsPlane?.material ?? new THREE.ShadowMaterial();
    materialShadow.opacity = 0.3;
    materialShadow.color = new THREE.Color(0x000000);

    const geometry = new THREE.PlaneGeometry(
      optionsPlane?.width ?? 3000,
      optionsPlane?.height ?? 3000,
      optionsPlane?.widthSegments ?? 30,
      optionsPlane?.heightSegments ?? 30
    );
    //geometry.rotateX(-Math.PI / 0.001);
    const plane = new THREE.Mesh(geometry, materialShadow);
    plane.name = "Plane";
    plane.position.z = optionsPlane?.position?.z ?? 0;
    plane.castShadow = optionsPlane?.shadow?.castShadow ?? true;
    plane.receiveShadow = optionsPlane?.shadow?.receiveShadow ?? true;
    ClientSVG3D.scene?.add(plane);
  }
  addHelpers(x: boolean, y: boolean, z: boolean): void {
    if (x) {
      ClientSVG3D.helper1 = new THREE.GridHelper(1600, 30, 0x0000ff, 0x808080);
      ClientSVG3D.helper1.rotation.x = Math.PI / 2;
      ClientSVG3D.helper1.name = "helperX";
      ClientSVG3D.scene?.add(ClientSVG3D.helper1);
    }
    if (y) {
      ClientSVG3D.helper2 = new THREE.GridHelper(1600, 30, 0x0000ff, 0x808080);
      ClientSVG3D.helper2.rotation.y = Math.PI / 2;
      ClientSVG3D.helper2.name = "helperY";
      ClientSVG3D.scene?.add(ClientSVG3D.helper2);
    }
    if (z) {
      ClientSVG3D.helper3 = new THREE.GridHelper(600, 30, 0x0000ff, 0x808080);
      ClientSVG3D.helper3.rotation.z = Math.PI / 2;
      ClientSVG3D.helper3.name = "helperZ";
      ClientSVG3D.scene?.add(ClientSVG3D.helper3);
    }
    const axesHelper = new THREE.AxesHelper(100);
    axesHelper.name = "axesHelper";
    ClientSVG3D.scene?.add(axesHelper);
  }
  addControls({
    isZoom = true,
    isPan = true,
    isRotate = true,
    minPolarAngle = Math.PI / 2,
    maxPolarAngle = Math.PI / 1.4,
    minDistance = 0,
    maxDistance = 10000,
    target = new THREE.Vector3(0, 0, 0),
  }): void {
    ClientSVG3D.controls = new OrbitControls(
      ClientSVG3D.camera!,
      ClientSVG3D.renderer?.domElement
    );

    ClientSVG3D.controls.addEventListener("change", this.renderEventControl);
    //ClientSVG3D.controls.screenSpacePanning = false;
    ClientSVG3D.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    ClientSVG3D.controls.dampingFactor = 0.05;

    ClientSVG3D.controls.enablePan = isPan;
    ClientSVG3D.controls.enableZoom = isZoom;
    ClientSVG3D.controls.enableRotate = isRotate;
    ClientSVG3D.controls.screenSpacePanning = true;

    ClientSVG3D.controls.minDistance = minDistance;
    ClientSVG3D.controls.maxDistance = maxDistance;

    ClientSVG3D.controls.minPolarAngle = minPolarAngle;
    ClientSVG3D.controls.maxPolarAngle = maxPolarAngle;
    ClientSVG3D.controls.maxAzimuthAngle = Math.PI;
    ClientSVG3D.controls.target = target;
    ClientSVG3D.controls.update();
    //ClientSVG3D.controls.reset();
  }
  addBox(boxparams: BoxParams): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(
      boxparams.height ?? 100,
      boxparams.width ?? 100,
      boxparams.depth ?? 100
    );
    const materialBox = boxparams.material ?? new THREE.MeshPhongMaterial();
    const cube = new THREE.Mesh(geometry, materialBox);
    cube.position.set(
      boxparams.position!.x ?? 0,
      boxparams.position!.y ?? 0,
      boxparams.position!.z ?? 0
    );
    cube.rotation.set(
      boxparams.rotation!.x ?? 0,
      boxparams.rotation!.y ?? 0,
      boxparams.rotation!.z ?? 0
    );
    cube.castShadow = boxparams.shadow?.castShadow ?? true;
    cube.receiveShadow = boxparams.shadow?.receiveShadow ?? true;
    ClientSVG3D.rootMap?.add(cube);
    ClientSVG3D.render();
    return cube;
  }
  addSphere(sphereparams: SphereParams): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(
      sphereparams.radius ?? 10,
      sphereparams.widthSegments ?? 32,
      sphereparams.heightSegments ?? 16
    );
    const materialSphere =
      sphereparams.material ?? new THREE.MeshPhongMaterial();
    const sphere = new THREE.Mesh(geometry, materialSphere);
    sphere.position.set(
      sphereparams.position!.x ?? 0,
      sphereparams.position!.y ?? 0,
      sphereparams.position!.z ?? 0
    );
    sphere.rotation.set(
      sphereparams.rotation!.x ?? 0,
      sphereparams.rotation!.y ?? 0,
      sphereparams.rotation!.z ?? 0
    );
    sphere.castShadow = sphereparams.shadow?.castShadow ?? true;
    sphere.receiveShadow = sphereparams.shadow?.receiveShadow ?? true;
    ClientSVG3D.rootMap?.add(sphere);
    ClientSVG3D.render();
    return sphere;
  }
  addExample(): void {
    const geometry = new THREE.BoxGeometry(60, 60, 60);
    const colors = new Uint8Array(25);
    const format = ClientSVG3D.renderer!.capabilities.isWebGL2
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
    ClientSVG3D.scene?.add(cube);
    const sphereGeometry = new THREE.SphereGeometry(40, 20, 20);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: "rgb(55,155,155)",
      emissive: 0x222222,
    });
    const sphere = new THREE.Mesh(sphereGeometry, materialToon);
    sphere.position.set(0, 0, 40);
    sphere.castShadow = true;
    ClientSVG3D.scene?.add(sphere);
  }
  async addGLB(options: LoadObject): Promise<void> {
    const classOptions = this.options;

    const dracoLoader = new DRACOLoader();
    ClientSVG3D.groupObjects!.position.set(
      options.positionGroup?.x as number,
      options.positionGroup?.y as number,
      options.positionGroup?.z as number
    );
    ClientSVG3D.groupObjects!.rotation.set(
      options.rotationGroup?.x as number,
      options.rotationGroup?.y as number,
      options.rotationGroup?.z as number
    );
    ClientSVG3D.groupObjects!.scale.set(
      options.scaleGroup?.x as number,
      options.scaleGroup?.y as number,
      options.scaleGroup?.z as number
    );

    if (ClientSVG3D.DEBUG)
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
        if (ClientSVG3D.DEBUG)
          console.log(" ### ==== #### addGLB gltf = > ", gltf);
        if (ClientSVG3D.DEBUG)
          console.log(" ### ==== #### addGLB model = > ", model);
        ClientSVG3D.mixer = new THREE.AnimationMixer(model);
        for (let idxAnim = 0; idxAnim < animations.length; idxAnim++) {
          const element = animations[idxAnim];
          if (ClientSVG3D.DEBUG)
            console.log(" ### ==== #### addGLB element = > ", element);
          const action = ClientSVG3D.mixer.clipAction(element);
          if (ClientSVG3D.DEBUG)
            console.log(" ### ==== #### addGLB action = > ", action);
          action.play();
        }
        if (ClientSVG3D.DEBUG)
          console.log(" ### ==== #### addGLB mixer = > ", ClientSVG3D.mixer);

        //ClientSVG3D.mixer.clipAction(gltf.animations[0]).play();

        ClientSVG3D.groupObjects?.add(model);

        ClientSVG3D.rootMap?.add(ClientSVG3D.groupObjects!);
        //ClientSVG3D.scene.add(ClientSVG3D.groupObjects);
        ClientSVG3D.render();
      },
      undefined,
      function (e: any) {
        console.error(e);
      }
    );
  }
  addPolyline(options: PolylineOptions): void {
    const points = [];
    for (let idx = 0; idx < options.points!.length; idx++) {
      const element = options.points![idx];
      points.push(new THREE.Vector3(element.x, element.y, element.z));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: options.color });
    const line = new THREE.Line(geometry, material);
    ClientSVG3D.groupObjects?.add(line);
    ClientSVG3D.rootMap?.add(ClientSVG3D.groupObjects!);
    ClientSVG3D.render();
  }
  addText(optionsText: TextOptions): void {
    const loader = new FontLoader();
    loader.load(optionsText.font, function (response: any) {
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

      if (ClientSVG3D.DEBUG)
        console.log(" ### ==== #### addText centerOffset = > ", centerOffset);
      const textMesh1 = new THREE.Mesh(textGeo, materialText);

      textMesh1.position.x = centerOffset + (optionsText.position?.x as number);
      textMesh1.position.y = optionsText.position?.y as number;
      textMesh1.position.z = optionsText.position?.z as number;

      textMesh1.rotation.x = optionsText.rotation?.x as number;
      textMesh1.rotation.y = optionsText.rotation?.y as number;
      textMesh1.rotation.z = optionsText.rotation?.z as number;
      textMesh1.castShadow = optionsText.shadow?.castShadow as boolean;
      textMesh1.receiveShadow = optionsText.shadow?.receiveShadow as boolean;
      if (ClientSVG3D.DEBUG)
        console.log(" ### ==== #### addText textMesh1 = > ", textMesh1);

      ClientSVG3D.groupTexts?.add(textMesh1);
      ClientSVG3D.rootMap?.add(ClientSVG3D.groupTexts!);
      //ClientSVG3D.scene.add(ClientSVG3D.groupTexts);
      ClientSVG3D.render();
      if (ClientSVG3D.DEBUG)
        console.log(
          " ### ==== #### addText tetxtGroup = > ",
          ClientSVG3D.groupTexts
        );
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
        if (ClientSVG3D.DEBUG)
          console.log("    ## addTextToSVGPoint paths => ", data);
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
        ClientSVG3D.rootMap?.add(ClientSVG3D.groupActive!);
        //ClientSVG3D.scene.add(ClientSVG3D.rootMap);
        ClientSVG3D.render();
      },
      function (xhr: { loaded: number; total: number }) {
        if (ClientSVG3D.DEBUG)
          console.log(
            (xhr.loaded / xhr.total) * 100 + "% loaded SHOPS for text"
          );
      },
      function (error: any) {
        if (ClientSVG3D.DEBUG) console.log("An error happened", error);
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

    if (ClientSVG3D.DEBUG)
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
                  if (ClientSVG3D.DEBUG)
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
                if (ClientSVG3D.DEBUG)
                  console.log(
                    " ### ==== #### addObjects load OBJ isAnimation = > ",
                    object
                  );
                /*this.addAnimation(object, {
                  //object: object,
                }); */
              }
              ClientSVG3D.groupObjects?.add(object);
              ClientSVG3D.rootMap?.add(ClientSVG3D.groupObjects!);
              ClientSVG3D.render();
              if (ClientSVG3D.DEBUG)
                console.log("ADD OBJECT SCENE = ", ClientSVG3D.scene);
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
            if (ClientSVG3D.DEBUG)
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
            if (ClientSVG3D.DEBUG)
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
          if (ClientSVG3D.DEBUG) console.log("SCENE LOAD OBJECT = ", object);
          if (ClientSVG3D.DEBUG)
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
            if (ClientSVG3D.DEBUG)
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
            ClientSVG3D.groupObjects?.add(object);
            ClientSVG3D.rootMap?.add(ClientSVG3D.groupObjects!);
            ClientSVG3D.render();
            if (ClientSVG3D.DEBUG) console.log("SCENE LOAD OBJECT = ", object);
            if (ClientSVG3D.DEBUG)
              console.log("SCENE LOAD OBJECT = ", ClientSVG3D.scene);
          });
          return object;
        })
        .catch((error) => {
          if (ClientSVG3D.DEBUG)
            console.log(" ### ==== #### load OBJ error = > ", error);
        });
      if (ClientSVG3D.DEBUG)
        console.log(" ### ==== #### RETURN loadOBJ = > ", ol);
      return ol;
    }
  }
  addAnimation(object: any, options: OptionsAnimationStep): void {
    if (ClientSVG3D.DEBUG)
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
    if (ClientSVG3D.DEBUG) console.log("options ==<>== ", options);
    if (ClientSVG3D.DEBUG) console.log("positionKF ==<>== ", positionKF);
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
    if (ClientSVG3D.DEBUG)
      console.log(" ### ==== #### addAnimation MIXER = > ", ClientSVG3D.mixer);
    // create a ClipAction and set it to play
    const clipAction = ClientSVG3D.mixer.clipAction(clip);
    clipAction.play();
  }
  async addSVGExtrudeObject(
    options: OptionsExtrudeObject,
    selectItems: string[] = []
  ): Promise<string> {
    const classOptions = this.options;
    const manager = new THREE.LoadingManager();
    const loaderSVG = new SVGLoader(manager);
    const groupSVGExtrude = new THREE.Group();
    if (ClientSVG3D.DEBUG)
      console.log(
        " ### ==== #### addSVGExtrudeObject loaderSVG = > ",
        loaderSVG
      );
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
        if (ClientSVG3D.DEBUG)
          console.log(" ### ==== #### addSVGExtrudeObject data = > ", data);
        if (ClientSVG3D.DEBUG)
          console.log(" ### ==== #### addSVGExtrudeObject paths = > ", paths);
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          const simpleShapes = SVGLoader.createShapes(path);
          for (let j = 0; j < simpleShapes.length; j++) {
            if (path.userData.node.parentNode.id === options.nameLayerSVG) {
              const simpleShape = simpleShapes[j];
              const shape3d = new THREE.ExtrudeGeometry(
                simpleShape,
                options.settingsExtrude
              );
              const mesh = new THREE.Mesh(shape3d, options.material);
              mesh.castShadow = options.shadow?.castShadow as boolean;
              mesh.receiveShadow = options.shadow?.receiveShadow as boolean;
              mesh.name = path.userData.node.id;
              groupSVGExtrude.add(mesh);
            }
          }
        }
        ClientSVG3D.rootMap?.add(groupSVGExtrude);
        ClientSVG3D.render();
        if (selectItems.length > 0) {
          selectItems.forEach((item: string) => {
            this.selectItem(item, false);
          });
        }
        return "OK";
      },
      function (xhr: { loaded: number; total: number }) {
        if (ClientSVG3D.DEBUG)
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded SHOPS");
      },
      function (error: any) {
        if (ClientSVG3D.DEBUG) console.log("An error happened", error);
      }
    );
    return "OK-2";
  }

  onProgress(xhr: { loaded: number; total: number }) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded ALL");
    //return "OK";
  }
  onError(error: any) {
    if (ClientSVG3D.DEBUG) console.log("An error happened", error);
  }
  selectItem(item: string, isClear = true): void {
    if (ClientSVG3D.DEBUG) console.log("selectItem => ", item);
    if (isClear) {
      this.clearColorActive();
    }
    const id = item;
    const group = ClientSVG3D.scene?.getObjectByName("active");

    if (ClientSVG3D.DEBUG)
      console.log("selectItem ClientSVG3D.scene => ", ClientSVG3D.scene);
    if (group) {
      const mesh = group.getObjectByName(id);
      if (ClientSVG3D.DEBUG) console.log("selectItem group => ", group);
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
        if (ClientSVG3D.DEBUG) console.log("mesh => ", mesh);
        ClientSVG3D.render();
      }
    }
  }

  start(): void {
    if (ClientSVG3D.DEBUG)
      console.log("start  ClientSVG3D", ClientSVG3D.nodeMap);
    //this.clearThree(ClientSVG3D.scene);
    //this.init();
    //this.animate();
    ClientSVG3D.scene = new THREE.Scene();
    this.scenePublic = ClientSVG3D.scene;
    ClientSVG3D.camera = new THREE.PerspectiveCamera();
    window.addEventListener("resize", this.onWindowResize);
    //document.addEventListener("mousemove", ClientSVG3D.myMouseMove);
    if (ClientSVG3D.DEBUG) console.log("start  this.options", this.options);
    if (this.options.isHoverEnable) {
      this.node.addEventListener(
        "mousemove",
        ClientSVG3D.onDocumentMouseMove,
        false
      );
    }
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

    ClientSVG3D.raycaster?.setFromCamera(
      ClientSVG3D.pointer!,
      ClientSVG3D.camera!
    );
    const vector = new THREE.Vector3(
      ClientSVG3D.mouse.x,
      ClientSVG3D.mouse.y,
      1
    );
    vector.unproject(ClientSVG3D.camera!);
    const ray = new THREE.Raycaster(
      ClientSVG3D.camera!.position,
      vector.sub(ClientSVG3D.camera!.position).normalize()
    );

    const groupActive = ClientSVG3D.scene?.getObjectByName("active");
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
        if (ClientSVG3D.DEBUG)
          console.log("MOUSE OVER", intersects[0].object.name);
        const groupActive = ClientSVG3D.scene?.getObjectByName("active");
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

      const groupActive = ClientSVG3D.scene?.getObjectByName("active");
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
    ClientSVG3D.renderer?.render(ClientSVG3D.scene!, ClientSVG3D.camera!);
    const delta = ClientSVG3D.clock?.getDelta();

    if (ClientSVG3D.mixer) {
      ClientSVG3D.mixer.update(delta!);
    }
    //ClientSVG3D.effect.render(ClientSVG3D.scene, ClientSVG3D.camera);
    /* console.log("render");
    console.log("SCENE", ClientSVG3D.scene); */
    //throw new Error("Method not implemented.");
  }
  clearColorActive(): void {
    if (ClientSVG3D.DEBUG) console.log("clearColorActive");
    const groupActive = ClientSVG3D.scene?.getObjectByName("active");
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
    if (ClientSVG3D.DEBUG) console.log("renderEventControl");
    ClientSVG3D.renderer?.render(ClientSVG3D.scene!, ClientSVG3D.camera!);
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
  disposeTHREE() {
    this.clearThree(ClientSVG3D.scene);
    ClientSVG3D.scene = null;
    ClientSVG3D.camera = null;
    ClientSVG3D.renderer = null;
    ClientSVG3D.controls = null;
    ClientSVG3D.raycaster = null;
    ClientSVG3D.INTERSECTED = null;
    ClientSVG3D.clock = null;
    ClientSVG3D.mixer = null;
    ClientSVG3D.effect = null;
    /* ClientSVG3D.composer = null;
    ClientSVG3D.renderPass = null; */
    ClientSVG3D.outlinePass = null;
    ClientSVG3D.scene = new THREE.Scene();
    console.log("disposeTHREE = ", ClientSVG3D.scene);
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
    ClientSVG3D.camera!.aspect = window.innerWidth / window.innerHeight;
    ClientSVG3D.camera?.updateProjectionMatrix();

    ClientSVG3D.renderer?.setSize(window.innerWidth, window.innerHeight);
    ClientSVG3D.controls?.update();
    ClientSVG3D.render();
  }

  /*   render() {
    ClientSVG3D.renderer.render(ClientSVG3D.scene, ClientSVG3D.camera);
    console.log("render");
  } */
  animate(loop = false) {
    if (ClientSVG3D.DEBUG) console.log("animate");

    if (ClientSVG3D.mixer !== undefined)
      ClientSVG3D.mixer?.update(ClientSVG3D.clock!.getDelta());
    if (loop) {
      requestAnimationFrame(() => this.animate(loop));
    }
    //requestAnimationFrame(ClientSVG3D.animate);
    ClientSVG3D.controls?.update();
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
