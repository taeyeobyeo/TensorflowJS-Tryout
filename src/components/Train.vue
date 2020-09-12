<template>
    <v-container d-flex>
        <v-card
            class="tvc"
            max-width="555"
            min-width="555"
            outlined
        >
            <v-card-title>Data</v-card-title>
            <v-card-subtitle></v-card-subtitle>
            <v-card-text>
                <v-list>
                    <v-list-item>
                        <div style="width:100%; display: flex; justify-content: space-around">
                            <div>X</div>
                            <div>Y</div>
                        </div>
                        <v-btn icon
                            @click="this.addItem"
                        ><v-icon color="primary">mdi-plus</v-icon>
                        </v-btn>
                    </v-list-item>
                    <v-list-item
                        v-for="(item, i) in xValues"
                        :key="i"
                    >
                        <v-text-field
                            class="pr-2"
                            type="number"
                            :label="'x' + (i + 1)"
                            v-model="xValues[i]"
                        />
                        <v-text-field
                            class="pr-2"
                            type="number"
                            :label="'y' + (i + 1)"
                            v-model="yValues[i]"
                        />
                        <v-btn icon
                            @click="() => {
                                xValues.splice(i, 1);
                                yValues.splice(i, 1);
                                dataLength--;
                            }"
                        >
                            <v-icon color="error">mdi-delete</v-icon>
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
            </v-card-actions>
        </v-card>
        <div>
            <v-card
                class="tvc"
                max-width="555"
                min-width="555"
                outlined
            >
                <v-card-title>Train</v-card-title>
                <v-card-subtitle>Fit</v-card-subtitle>
                <v-card-text>
                    <v-list>
                        <!-- <v-list-item>
                            <v-list-item-title>Layers</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                            v-for="(layer, i) in layers"
                            :key="'layer' + i"
                        >
                            <div>unit</div>
                            <div>activation</div>
                            <div>useBias</div>
                            <div>kernelInitializer</div>
                            <div>biasInitializer</div>
                            <div>inputDim</div>
                            <div>kernelConstraint</div>
                            <div>biasConstraint</div>
                            <div>kernelRegularizer</div>
                            <div>biasRegularizer</div>
                            <div>activityRegularizer</div>
                            <div>inputShape</div>
                            <div>batchInputShape</div>
                            <div>batchSize</div>
                            <div>name</div>
                            <div>trainable</div>
                            <div>weights</div>
                            <div>inputDType</div>
                        </v-list-item> -->
                        <!-- <v-list-item>
                            <v-list-item-title>Fit</v-list-item-title>
                        </v-list-item> -->
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Batch Size</v-list-item-title>
                                <!-- <v-list-item-subtitle>(number: 32) Number of samples per gradient update.</v-list-item-subtitle> -->
                            </v-list-item-content>
                            <!-- <v-text-field :value="option.batchSize"></v-text-field>
                            -->
                            <v-slider
                                v-model="option.batchSize"
                                thumb-label="always"
                                min="1"
                                max="128"
                            />
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Epochs</v-list-item-title>
                                <!-- <v-list-item-subtitle>(number: 5) Integer number of times to iterate over the training data arrays.</v-list-item-subtitle> -->
                            </v-list-item-content>
                            <v-slider
                                v-model="option.epochs"
                                thumb-label="always"
                                min="50"
                                max="5000"
                                step="50"
                            />
                        </v-list-item>
                        <!-- <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Verbose</v-list-item-title>
                                <v-list-item-subtitle>(number: 1) Expected to be 0, 1, or 2.</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-select
                                v-model="option.verbose"
                                outlined
                                :items="verbose"
                            />
                        </v-list-item> -->
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Shuffle</v-list-item-title>
                                <!-- <v-list-item-subtitle>(boolean) Whether to shuffle the training data before each epoch.</v-list-item-subtitle> -->
                            </v-list-item-content>
                            <v-switch v-model="option.shuffle"></v-switch>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Yield Every</v-list-item-title>
                                <!-- <v-list-item-subtitle>(YieldEveryOptions: auto) Configures the frequency of yielding main thread.</v-list-item-subtitle> -->
                            </v-list-item-content>
                            <v-select
                                style="width: 0.5rem"
                                v-model="option.yieldEvery"
                                :items="yieldEvery"
                            />
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-progress-linear
                    :active="loading"
                    :indeterminate="loading"
                    absolute
                    bottom
                    color="deep-purple accent-4"
                ></v-progress-linear>
                <v-card-actions>
                    <v-btn text
                        @click="this.default"
                    >Default</v-btn>
                    <v-btn text
                        @click="this.train"
                    >Train</v-btn>
                </v-card-actions>
            </v-card>
        
            <v-card
                class="tvc"
                max-width="555"
                min-width="555"
                outlined
            >
                <v-card-title>Predict</v-card-title>
                <v-card-subtitle></v-card-subtitle>
                <v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-text-field
                                class="pr-2"
                                label="Input"
                                placeholder="x-coordinate"
                                type="number"
                                v-model="predictValue"
                            />
                            <v-list-item-content>
                                <v-list-item-title>
                                    Result: {{prediction}}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-btn text
                        :disabled="!this.trained"
                        @click="this.predict"
                    >Predict</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </v-container>
</template>

<script>
import * as tf from "@tensorflow/tfjs";

export default {
    name: 'Train',
    data: () => ({
        trained: false,
        xValues: [],
        yValues: [],
        dataLength: 10,
        layers: [{units: 1, inputShape: [1]}],
        prediction: null,
        option: {batchSize: 32, epochs: 50},
        yieldEvery: ['auto', 'batch', 'epoch', 'number', 'never'],
        predictValue: 0,
        loading: false
        // verbose: [0, 1, 2]
    }),
    beforeMount() {
        for (let i = 0; i < this.dataLength; i++) {
            this.xValues.push(i);
            this.yValues.push(i + 2);
        }
    },
    methods: {
        log() {
            console.log(this.option);
        },
        addItem() {
            this.dataLength++;
            this.xValues.push(this.xValues.length + 1),
            this.yValues.push(0)
        },
        async train() {
            const model = this.model = tf.sequential();
            this.layers.forEach(layer => model.add(tf.layers.dense(layer)));
            model.compile({loss: "meanSquaredError", optimizer: "sgd"});
            const xs = tf.tensor2d(this.xValues, [this.xValues.length, 1], "float32");
            const ys = tf.tensor2d(this.yValues, [this.yValues.length, 1], "float32");
            this.loading = true;
            await model.fit(xs, ys, this.option);
            this.loading = false;
            this.trained = true;
        },
        default() {
            this.option = {batchSize: 32, epochs: 50};
        },
        async predict() {
            const result = await this.model.predict(tf.tensor2d([this.predictValue], [1, 1], "float32")).array();
            console.log(result);
            this.prediction = result[0][0];
        }
    }
}
</script>

<style scoped>
    .tvc {
        margin: 1.0rem;    
    }
</style>