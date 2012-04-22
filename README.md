OGV Game Framework in JS v0.1
==============================
Very simple game framework in JS suited to my own workflow.
It's very likely this framework is awful considering my lack of js and gl skill.

# Implemented 3 basic renderer:
- Basic: phong shading + 1 texture + exponential fog
- outline: draw outline + exponential fog
- pick: for picking using color coded method. Register callback to pickunit.

#Performance
Bad? currently 33FPS on my chrome with 100 teapot @ > ~1000 vertices each