import { onBeforeUnmount, watch, type Ref } from 'vue'
import { UseIntersectionObserverOptions } from './types/UseIntersectionObserverOptions'

/**
 * A composable that sets up an Intersection Observer on a target element.
 * @param target - A ref to the target element to observe.
 * @param onIntersect - A callback function to be called when the target intersects.
 * @param options - Optional Intersection Observer options.
 */
export function useIntersectionObserver(
    target: Ref<Element | null>,
    onIntersect: (entry: IntersectionObserverEntry) => void,
    options?: UseIntersectionObserverOptions
) {
    let observer: IntersectionObserver | null = null;

    const stop = watch(() => target.value, (el) => {
        if (!el || observer) return;

        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting)
                    onIntersect(entry);
            });
        }, options);

        observer.observe(el);
    },
        { immediate: true }
    );

    onBeforeUnmount(() => {
        observer?.disconnect();
        observer = null;
        stop();
    });
}
