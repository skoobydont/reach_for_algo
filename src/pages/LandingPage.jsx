import React, { useState, useEffect } from 'react';
// MUI
import { makeStyles, useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  CylinderGeometry,
} from 'three';
// Custom
// import SearchComponent from '../components/SearchComponent';
// import exampleData from '../example-data.json';
// import PropertyListComponent from '../components/PropertyListComponent';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '8px',
    justifyContent: 'center',
    '& .MuiInputBase-root': {
      margin: 'auto',
      maxWidth: theme.spacing(35),
    },
  },
  canvas: {
    '& canvas': {
      margin: 'auto',
    },
    backgroundColor: '#000',
  }
}));

const LandingPage = () => {
  const classes = useStyles();
  const theme = useTheme();
  // setup scene, camera & renderer
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [shape, setShape] = useState(null);
  const [maxX, setMaxX] = useState(null);
  const [maxY, setMaxY] = useState(null);
  /**
   * Ensure scene, camera, renderer & shape not null
   * @constant
   * @type {Boolean}
   */
  const allReady = (
    scene !== null
    && camera !== null
    && renderer !== null
    && shape !== null
  );
  /**
   * Generate Shape
   * @param {String} shp the desired shape
   * @param {string} color of generated shape
   * @param {Boolean} wire wireframe option
   * @returns {Object} new Mesh instance with given options
   */
  const generateShape = (shp, color, wire = false) => {
    // setup geometry stuff
    let geometry = null;
    switch (shp) {
      case 'box':
        geometry = new BoxGeometry();
        break;
      case 'pyramid':
        geometry = new CylinderGeometry(
          0,
          1,
          3,
          4,
        );
        break;
      default:
        geometry = null;
    }
    const material = new MeshBasicMaterial({
      color,
      wireframe: wire,
    });
    return new Mesh(geometry, material);
  };
  /**
   * Rotate Shape Accross Y Axis
   * @constant
   * @fires requestAnimationFrame
   * @fires renderer.render() with updated scene & camera
   */
  const rotateY = () => {
    requestAnimationFrame(rotateY);
    // only want to spin accross y axis
    // setMaxY(shape.rotation.y += 0.0025);
    if (shape.rotation.y <= 5) {
      shape.rotation.y += 0.0025;
    }
    // render updated scene / camera
    renderer.render(scene, camera);
  };
  /**
   * Rotate Shape Accross X Axis
   * @constant
   * @fires requestAnimationFrame
   * @fires renderer.render() with updated scene & camera
   */
   const rotateX = () => {
    // after this request animation frame
    // is where custom x rotation logic should reside
    requestAnimationFrame(rotateX);
    // only want to spin accross x axis under 10
    // seems 6.5 is a full rotation
    const fullRotation = 6.45;
    if (shape.rotation.x <= (1 * fullRotation)) {
      shape.rotation.x += 0.025;
    }
    // render updated scene / camera
    renderer.render(scene, camera);
  };
  /**
   * Rotate Shape (may need reworked to handle different scenarios)
   * @constant
   * @fires rotateY
   * @fires rotateX
   * @description fires off rotate Y then rotate X
   *  (each run in totallity before the next)
   */
  const rotateShape = () => {
    // call custom rotating logic here
    rotateY();
    rotateX();
  }
  // setup state
  useEffect(() => {
    if (scene === null) {
      setScene(new Scene());
    }
    if (camera === null) {
      setCamera(new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      ));
    }
    if (renderer === null) {
      setRenderer(new WebGLRenderer());
    } else {
      renderer.setSize(
        window.innerWidth,
        window.innerHeight / 2,
      );
      // document.body.appendChild(renderer.domElement);
      document.getElementById('myCanvas').appendChild(renderer.domElement);
    }
  }, [scene, camera, renderer]);
  // add to scene
  useEffect(() => {
    if (scene !== null
      && camera !== null
      && renderer !== null
      && shape === null) {
        const theShape = generateShape(
          'pyramid',
          theme.palette.error.main,
          true,
        );
        setShape(theShape);
        scene.add(theShape);
        camera.position.z = 5;
      }
  }, [scene, camera, renderer, shape, theme]); 

  return (
    <div id="myCanvas" className={classes.canvas}>
      {allReady
        ? rotateShape()
        : null}
    </div>
  );
}
export default LandingPage;
