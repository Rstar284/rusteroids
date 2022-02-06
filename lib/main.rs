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

pub mod render;

use control::Controls;
// use font::FontLibrary;
use game::Game;
// use typography::Font;

use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub struct App(Game);

#[wasm_bindgen]
impl App {
    pub fn new() -> Self {
        App(Game::new())
    }

    pub fn step(&mut self, dt: f64, input: u32) {
        if dt <= 0.0 {
            ()
        }

        self.0.step(dt, Controls::new(input))
    }
}
