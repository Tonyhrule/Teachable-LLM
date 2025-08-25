import { pipeline, env } from '@huggingface/transformers';
import { isWebGPUSupported } from './helpers/webgpu';

env.allowLocalModels = false;

const embedderPromise = isWebGPUSupported().then((supported) =>
  pipeline('feature-extraction', 'Xenova/nomic-embed-text-v1', {
    dtype: 'fp16',
    device: supported ? 'webgpu' : 'wasm',
  }),
);

self.addEventListener('message', async (event) => {
  const embedder = await embedderPromise;

  const output = await embedder(event.data, {
    pooling: 'mean',
    normalize: true,
  }).then((t) => t.tolist());

  self.postMessage(output);
});
