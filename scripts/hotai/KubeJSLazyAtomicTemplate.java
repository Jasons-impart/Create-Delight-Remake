import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;

/** Java 17 bytecode template; only its field and constructor/get/forget bodies are transplanted. */
final class KubeJSLazyAtomicTemplate implements Supplier<Object> {
    private final Supplier<Object> factory;
    private final long expires;
    // Empty array = absent; one element = cached, including a legitimate null value.
    private final AtomicReference<Object[]> createdelight$atomicState = new AtomicReference<>(new Object[0]);

    private KubeJSLazyAtomicTemplate(Supplier<Object> factory, long expires) {
        this.factory = factory;
        this.expires = expires;
    }

    @Override
    public Object get() {
        Object[] observed = createdelight$atomicState.get();
        if (observed.length != 0 && (expires <= 0 || System.currentTimeMillis() <= expires)) {
            return observed[0];
        }
        // No monitor, future wait, spin or retry around arbitrary user callbacks.
        Object computed = factory.get();
        createdelight$atomicState.compareAndSet(observed, new Object[]{computed});
        return computed;
    }

    public void forget() {
        // Fresh identity prevents a pre-invalidation computation from refilling the cache (including ABA).
        createdelight$atomicState.set(new Object[0]);
    }
}
