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

use crate::render::PathList;

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

    pub fn render(&self) -> PathList {
        let mut list = PathList::new();
        if let Some(player) = self.0.player() {
            render::player(player, &mut list);
        }

        render::asteroids(self.0.asteroids(), &mut list);
        render::blasts(self.0.blasts(), &mut list);
        render::particles(self.0.particles(), &mut list);
        render::polylines(self.0.text(), 1.0, &mut list);
        render::polylines(&self.0.hud(), 0.3, &mut list);
        list
    }
}
