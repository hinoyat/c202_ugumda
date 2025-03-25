import time
from runwayml import RunwayML
import logging
from app.log_config import logging_check

logging_check()

def runway(image_base64:str, prompt:str):

    client = RunwayML()

    # Create a new image-to-video task using the "gen3a_turbo" model
    task = client.image_to_video.create(
      model='gen3a_turbo',
      # Point this at your own image file
      prompt_image=f"data:image/png;base64,{image_base64}",
      prompt_text=f'{prompt}',
    )
    task_id = task.id

    # Poll the task until it's complete
    time.sleep(10)  # Wait for a second before polling
    task = client.tasks.retrieve(task_id)
    while task.status not in ['SUCCEEDED', 'FAILED']:
      time.sleep(10)  # Wait for ten seconds before polling
      task = client.tasks.retrieve(task_id)

    logging.info(task.output[0])

    return task.output[0]