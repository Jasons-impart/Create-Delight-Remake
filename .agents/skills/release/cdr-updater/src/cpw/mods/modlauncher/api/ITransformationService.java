package cpw.mods.modlauncher.api;

import java.util.List;
import java.util.Set;

public interface ITransformationService {
    String name();

    void initialize(IEnvironment environment);

    void onLoad(IEnvironment env, Set<String> otherServices) throws IncompatibleEnvironmentException;

    List<ITransformer> transformers();
}
