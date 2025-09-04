import random
import time
import os
import asyncio

try:
    from pyscript import document
    PYSCRIPT_AVAILABLE = True
except ImportError:
    PYSCRIPT_AVAILABLE = False

def create_grid(height: int, width: int) -> list:
    grid = [[random.choice([0, 1]) for _ in range(width)] for _ in range(height)]
    return grid

def check_neighbors(grid: list[list[int]], r: int, c: int) -> int:
    counter = 0

    for row_offset in [-1, 0, 1]:
        for col_offset in [-1, 0, 1]:

            neighbor_r = r + row_offset
            neighbor_c = c + col_offset

            if row_offset == 0 and col_offset == 0:
                continue

            if neighbor_r < 0 or neighbor_r >= len(grid):
                continue

            if neighbor_c < 0 or neighbor_c >= len(grid[0]):
                continue

            if grid[neighbor_r][neighbor_c] > 0:
                counter += 1

    return counter

def get_next_state(is_alive: int, neighbor_count: int) -> int:
    if is_alive == 1:
        if neighbor_count == 2 or neighbor_count == 3:
            return 1
    else:
        if neighbor_count == 3:
            return 1
    return 0
        
def get_next_grid(current_grid: list[list[int]]) -> list[list[int]]:
    height = len(current_grid)
    width = len(current_grid[0])
    next_grid = [[0 for _ in range(width)] for _ in range(height)]
    
    for r in range(len(current_grid)):
        for c in range(len(current_grid[0])):
            next_grid[r][c] = get_next_state(current_grid[r][c], check_neighbors(current_grid, r, c))

    return next_grid

def print_grid(grid: list[list[int]]) -> None:
    for r in range(len(grid)):
        line = ""
        for c in range(len(grid[0])):
            if grid[r][c] == 1:
                line += "■"
            else:
                line += " "
        print(line)

def clear_console():
    if os.name == 'nt':  # For Windows
        _ = os.system('cls')
    else:  # For macOS and Linux
        _ = os.system('clear')

def draw_grid(grid: list[list[int]], canvas_w=None, canvas_h=None, context=None) -> None:
    if not PYSCRIPT_AVAILABLE:
        return
    cell_width = canvas_w / len(grid[0])
    cell_height = canvas_h / len(grid)

    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] > 0:
                pixel_x = c * cell_width
                pixel_y = r * cell_height
                context.fillRect(pixel_x, pixel_y, cell_width, cell_height)

async def animate():
    # This function will run the entire game
    # 1. Get the canvas and context
    canvas = document.getElementById("game-canvas")
    canvas_width = canvas.width
    canvas_height = canvas.height
    
    ctx = canvas.getContext("2d")
    ctx.fillStyle = "blue"

    # 2. Create the initial world
    GRID_HEIGHT = 250
    GRID_WIDTH = 250
    world = create_grid(GRID_HEIGHT, GRID_WIDTH)

    # 3. Start the main animation loop
    while True:
        # a. Erase the previous frame
        ctx.clearRect(0, 0, canvas_width, canvas_height)
        
        # b. Draw the current `world`
        draw_grid(world, canvas_width, canvas_height, ctx)
        
        # c. Calculate the *next* `world` state
        world = get_next_grid(world)

        # Pause for a fraction of a second without freezing
        await asyncio.sleep(0.1)

if __name__ == "__main__":
    if PYSCRIPT_AVAILABLE:
        # Browser mode with PyScript - start the animation
        asyncio.ensure_future(animate())
    else:
        # Console mode
        GRID_HEIGHT = 20
        GRID_WIDTH = 40
        world = create_grid(GRID_HEIGHT, GRID_WIDTH)

        for _ in range(100):
            world = get_next_grid(world)
            print_grid(world)
            time.sleep(0.2)
            clear_console()