/**
 * @file lib.js
 * @description Main entry point for the ModernLib library.
 * @module ModernLib
 */

/**
 * Import and initialize all modules and components of the ModernLib.
 * @type {Object}
 * @const
 */
import $ from "./core";
import "./modules/display";
import "./modules/classes";
import "./modules/actions";
import "./modules/handlers";
import "./modules/attributes";
import "./modules/actions";
import "./modules/effects";

import "./components/dropdown";
import "./components/modal";
import "./components/tab";
import "./components/accordion";
import "./components/carousel";
import "./components/navigation";
import "./components/postGenerator";
import "./components/loadPosts";
import "./components/loadPostsLocal";
import "./components/pagination";
import "./components/carouselBlog";
import "./components/cardGenerator";

import "./services/request";

export default $;
