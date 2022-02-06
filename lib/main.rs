mod asteroid;
mod blast;
mod control;
mod font;
mod game;
mod geometry;
mod iter;
mod level;
mod motion;
mod particle;
mod player;
mod typography;
mod util;

use control::Controls;
use font::FontLibrary;
use game::Game;
use typography::Font;

use wasm_bindgen::prelude::wasm_bindgen;

pub struct App(Game);

impl App {
    pub fn new() -> Self {
        App(Game::new())
    }
}
