import { ClientSVG3D } from "../src/clientSVG3D";
import { DataInteractive } from "../src/models/simple.models";
import {
  dataShops2,
  dataShops,
  dataShops3,
  dataShops4Floor0,
  dataShops4Floor1,
  dataShops4Floor2,
  dataShops4Floor3,
  dataShops4Floor4,
  dataShops4Floor5,
  ExampleSVG,
  dataArraySelectShops1,
  dataArraySelectShops2,
} from "./dataItems";

export function testmylib(): boolean {
  console.log("testmylib");
  const nodeMap = document.getElementById("map3d");

  const baloonTheme = {
    colorBG: "#eeeeee",
    colorTitle: "#000000",
    colorDescription: "#000000",
    isPositionFixed: false,
    top: 0,
    left: 0,
  };

  const map1 = new ClientSVG3D(
    nodeMap, // node - dom element to insert svg
    dataShops2, // dataItems - data to render
    {
      title: "Пример карты", // Head Title this map
      urlmap: "./public/shlk-floor-1.svg", // Path to map svg
      isRemoveUnuseItem: false, // Remove unuse item from map?
      funcParams: "https://www.google.com", // Params for function click on item
      mapTheme: {
        // Theme for map
        colorBG: "#ffdd3d", // Background color this map
        colorItem: "#aaa", // Fill Color for item
        colorHoverItem: "#9e3232", // Fill Color for item on hover
        colorSelectItem: "#0000ff", // Fill Color for item on select
        opacityItem: 0.0, // Opacity for item
        opacityHoverItem: 0.3, // Opacity for item on hover
        opacitySelectItem: 1, // Opacity for item on select
        colorBorderItem: "#000000", // Border color for item
        colorBorderHoverItem: "#ffffff", // Border color for item on hover
        colorBorderSelectItem: "#ffffff", // Border color for item on select
        isBorderItem: false, // Is set Border for item
        isBorderHoverItem: false, // Is set Border for item on hover
        isBorderSelectItem: false, // Is set Border for item on select
        widthBorderItem: 2, // Width for border item
        widthBorderHoverItem: 2, // Width for border item on hover
        widthBorderSelectItem: 2, // Width for border item on select
      },
    },
    baloonTheme
  );

  const startMap = map1.start();
  console.log(startMap);

  function gotoURLClick(dataelement: any): void {
    console.log("gotoURLClick element = ", dataelement);
    //const geturl = dataelement.getAttribute('data-url')

    window.open(dataelement.slug, "_self");
  }
  return true;
}
