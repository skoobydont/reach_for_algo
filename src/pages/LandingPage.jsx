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
  // helper
  const allReady = (
    scene !== null
    && camera !== null
    && renderer !== null
    && shape !== null
  );
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
  }
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
  // scene.add(shape);


  const animate = () => {
    requestAnimationFrame(animate);
    // shape.rotation.x += 0.01;
    shape.rotation.y += 0.0025;

    renderer.render(scene, camera);
  };

  return (
    <div id="myCanvas" className={classes.canvas}>
      {allReady
        ? animate()
        : null}
    </div>
  );
}
export default LandingPage;
