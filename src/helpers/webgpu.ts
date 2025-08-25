export const isWebGPUSupported = async () =>
  // @ts-expect-error WebGPU is not yet a standard feature
  !navigator.gpu
    ? false
    : // @ts-expect-error WebGPU is not yet a standard feature
      navigator.gpu
        .requestAdapter()
        .then(
          // @ts-expect-error WebGPU is not yet a standard feature
          (adapter: GPUAdapter | undefined) => !!adapter,
          () => false,
        )
        .catch(() => false);
