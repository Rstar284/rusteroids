mod control;
mod game;
mod typography;

use control::Controls;
use game::Game;
use typography::Font;

use wasm_bindgen::prelude::wasm_bindgen;

pub struct App(Game);

impl App {}
