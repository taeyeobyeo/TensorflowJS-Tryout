<template>
    <v-container d-flex>
        <v-card
            class="tvc"
            max-width="555"
            min-width="555"
            outlined
        >
            <v-card-title>Data
                <v-spacer/>
                <v-btn text @click="pivonachi">
                    pivonachi
                </v-btn>
                <v-btn text @click="linear">
                    Linear
                </v-btn>
                <v-btn text @click="square">
                    Square
                </v-btn>
            </v-card-title>
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
                        <v-btn text @click="this.add10" >+10</v-btn>
                        <v-btn text @click="this.add100" >+100</v-btn>
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
                <v-card-title>Layers
                    <v-spacer/>
                    <v-btn text @click="addLayer">Add</v-btn>
                </v-card-title>
                <v-card-subtitle></v-card-subtitle>
                <v-card-text>
                    <v-list>
                        <v-list-item three-line
                            v-for="(layer, i) in layers"
                            :key="'layer' + i"
                        >
                            <v-slider
                                label="Units"
                                min="1"
                                max="100"
                                v-model="layer.units"
                                thumb-label="always"
                            />
                            <v-spacer/>
                            <v-select
                                style="width: 1.0rem"
                                label="Activation"
                                v-model="layer.activation"
                                outlined
                                :items="activation"
                            />
                            <v-btn icon @click="() => layers.splice(i, 1)">
                                <v-icon color="error">mdi-delete</v-icon>
                            </v-btn>
                            <!-- <div>useBias</div>
                            <div>kernelInitializer</div>
                            <div>biasInitializer</div>
                            <div>inputDim</div>
                            <div>kernelConstraint</div>
                            <div>biasConstraint</div>
                            <div>kernelRegularizer</div>
                            <div>biasRegularizer</div>
                            <div>activityRegularizer</div> -->
                            <!-- <div>inputShape</div>
                            <div>batchInputShape</div>
                            <div>batchSize</div>
                            <div>name</div>
                            <div>trainable</div>
                            <div>weights</div> -->
                            <!-- <div>inputDType</div> -->
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-btn text @click="defaultLayer">Default</v-btn>
                </v-card-actions>    
            </v-card>
            <v-card
                class="tvc"
                max-width="555"
                min-width="555"
                outlined
            >
                <v-card-title>Train</v-card-title>
                <!-- <v-card-subtitle>Fit</v-card-subtitle> -->
                <v-card-text>
                    <v-list>

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
                                min="32"
                                max="512"
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
                        :disabled="!this.trained && this.loading"
                        @click="this.predict"
                    >Predict</v-btn>
                    <v-btn text
                        :disabled="this.loading"
                        @click="this.vis"
                    >VIS</v-btn>
                    <v-btn text
                        :disabled="!this.trained && this.loading"
                        @click="this.test"
                    >TEST</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </v-container>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as _ from "lodash";
import BlockHelper from "../singleton/Blockhelper";

export default {
    name: 'Linear',
    data: () => ({
        trained: false,
        xValues: [],
        yValues: [],
        data: null,
        dataLength: 10,
        layers: [{units: 24, activation: 'sigmoid'}],
        activation: ['elu', 'hardSigmoid', 'linear', 'relu', 'relu6', 'selu', 'sigmoid', 'softmax', 'softplus', 'softsign', 'tanh'],
        prediction: null,
        option: {batchSize: 32, epochs: 50},
        yieldEvery: ['auto', 'batch', 'epoch', 'number', 'never'],
        predictValue: 0,
        loading: false,
        tensor: null,
        // verbose: [0, 1, 2]
    }),
    beforeMount() {
        for (let i = 0; i < this.dataLength; i++) {
            this.xValues.push(i);
            this.yValues.push(i + 2);
        }
        this.run();
    },
    methods: {
        log() {
            console.log(this.layers);
        },
        pivonachi() {
            this.xValues = this.xValues.map((x, i) => i + 1);
            this.yValues = this.yValues.reduce((acc, c, i) => {
                acc.push(i < 2 ? 1 :acc[i - 2] + acc[i - 1]);
                return acc;
            }, []);
            this.run();
        },
        linear() {
            this.xValues = this.xValues.map((x, i) => i + 1);
            this.yValues = this.yValues.map((y, i) => i + 1);
            this.run();
        },
        square() {
            this.xValues = this.xValues.map((x, i) => i + 1);
            this.yValues = this.yValues.map((y, i) => (i + 1)*(i + 1));
            this.run();
        },
        addItem() {
            this.dataLength++;
            this.xValues.push(this.xValues.length + 1);
            this.yValues.push(0);
            this.run();
        },
        async add10() {
            BlockHelper.block();
            for (let i = 0; i < 10; i++) this.addItem();
            this.run();
            BlockHelper.unblock();
        },
        async add100() {
            BlockHelper.block();
            await setTimeout(null, 50);
            for (let i = 0; i < 100; i++) this.addItem();
            this.run();
            BlockHelper.unblock();
        },
        addLayer() {
            this.layers.push({units: 1, activation: "sigmoid"});
        },
        defaultLayer() {
            this.layers = [{units: 1, activation: "sigmoid"}];
        },
        run() {
            const values = this.xValues.map((x, i) => ({
                x,
                y: this.yValues[i],
            }));
            tfvis.render.scatterplot(
                {name: 'X : Y'},
                {values}, 
                {
                    xLabel: 'X',
                    yLabel: 'Y',
                    height: 300
                }
            )
        },
        createModel() {
            this.model = tf.sequential();
            this.model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));

            this.layers.forEach(layer => this.model.add(tf.layers.dense(layer)));

            // Add an output layer
            this.model.add(tf.layers.dense({units: 1, useBias: true}));
            
            tfvis.show.modelSummary({name: 'Model Summary'}, this.model);
            return this.model;
        },
        async train() {
            const model = this.createModel();

            // model.compile({loss: "meanSquaredError", optimizer: "sgd"});
            model.compile({
                optimizer: tf.train.adam(),
                loss: tf.losses.meanSquaredError,
                metrics: ['mse'],
            });
            this.data = this.xValues.map((x, i) => ({
                x,
                y: this.yValues[i]
            }));
            this.tensor = tf.tidy(() => {
                tf.util.shuffle(this.data);

                const inputs = this.data.map(d => d.x)
                const labels = this.data.map(d => d.y);

                const inputTensor = tf.tensor2d(inputs, [inputs.length, 1], "float32");
                const labelTensor = tf.tensor2d(labels, [labels.length, 1], "float32");

                const inputMax = inputTensor.max();
                const inputMin = inputTensor.min();  
                const labelMax = labelTensor.max();
                const labelMin = labelTensor.min();

                const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
                const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

                return {
                    inputs: normalizedInputs,
                    labels: normalizedLabels,
                    // Return the min/max bounds so we can use them later.
                    inputMax,
                    inputMin,
                    labelMax,
                    labelMin,
                }
            });

            this.loading = true;
            await model.fit(this.tensor.inputs, this.tensor.labels, _.merge({
                callbacks: tfvis.show.fitCallbacks(
                    { name: 'Training Performance' },
                    ['loss', 'mse'], 
                    { height: 200, callbacks: ['onEpochEnd'] }
                )
            }, this.option));
            this.loading = false;
            this.trained = true;
        },
        default() {
            this.option = {batchSize: 32, epochs: 50};
        },
        async predict() {
            const result = tf.tidy(() => {
                const input = tf.linspace(this.predictValue, this.predictValue, 10).reshape([10, 1]);
                return this.model.predict(input)
                    .mul(this.tensor.labelMax.sub(this.tensor.labelMin))
                    .add(this.tensor.labelMin)
                    .dataSync();
            });
            this.prediction = result[0];
        },
        vis() {
            tfvis.visor().toggle();
        },
        test() {
            const [xs, preds] = tf.tidy(() => {
                
                const xs = tf.linspace(0, 1, 100);      
                const preds = this.model.predict(xs.reshape([100, 1]));      
                
                const unNormXs = xs
                    .mul(this.tensor.inputMax.sub(this.tensor.inputMin))
                    .add(this.tensor.inputMin);
                
                const unNormPreds = preds
                    .mul(this.tensor.labelMax.sub(this.tensor.labelMin))
                    .add(this.tensor.labelMin);
                
                // Un-normalize the data
                return [unNormXs.dataSync(), unNormPreds.dataSync()];
            });
            
            
            const predictedPoints = Array.from(xs).map((val, i) => {
                return {x: val, y: preds[i]}
            });
            
            const originalPoints = this.data;
            
            tfvis.render.scatterplot(
                {name: 'Model Predictions vs Original Data'}, 
                {values: [originalPoints, predictedPoints], series: ['original', 'predicted']}, 
                {
                    xLabel: 'X value',
                    yLabel: 'Y value',
                    height: 300
                }
            );
        }
    }
}
</script>

<style scoped>
</style>