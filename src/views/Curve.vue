<template>
    <v-container>
        <v-card
            class="tvc"
            max-width="555"
            min-width="555"
            outlined
        >
            <v-card-title>Data
                <v-spacer/>
                <v-btn v-if="cleaned" text color="primary" @click="this.toggleDetail">
                    Detail
                </v-btn>
                <v-btn v-if="cleaned" text @click="this.run">
                    Draw
                </v-btn>
                <v-btn v-if="!cleaned" text color="primary" @click="this.getData">
                    Load
                </v-btn>
            </v-card-title>
            <v-cart-text>
                <v-list v-if="!cleaned">
                    <v-list-item>
                        <v-list-item-title>No Data</v-list-item-title>
                    </v-list-item>
                </v-list>
                <v-list v-else-if="cleaned.length > 0 && detail === false">
                    <v-list-item>
                        <v-list-item-title>Data Loaded</v-list-item-title>
                    </v-list-item>
                </v-list>
                <v-list v-else>
                    <v-list-item>
                        <v-list-item-title>Horsepower</v-list-item-title>
                        <v-list-item-subtitle>MPG</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                        v-for="(item, i) in cleaned"
                        :key="'carData_' + i"
                    >
                        <v-list-item-title>{{item.horsepower}}</v-list-item-title>
                        <v-list-item-subtitle>{{item.mpg}}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-cart-text>
        </v-card>
        <v-card
            class="tvc"
            max-width="555"
            min-width="555"
            outlined
        >
            <v-progress-linear
                :active="training"
                :indeterminate="training"
                absolute
                top
                color="error"
            ></v-progress-linear>
            <v-card-title>Model
                <v-spacer/>
                <v-btn text @click="createModel">
                    CreateModel
                </v-btn>
                <v-btn v-if="model && !trained && cleaned && !trained" text @click="train">
                    Train
                </v-btn>
                <v-btn v-if="trained" text @click="test">
                    Test
                </v-btn>
            </v-card-title>
            <v-card-subtitle></v-card-subtitle>
            <v-card-text>

            </v-card-text>
            <v-card-actions>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

export default {
    name: 'Curve',
    data: () => ({
        cleaned: null,
        detail: false,
        plot: false,
        model: null,
        trained: false,
        tensorData: null,
        training: false,
    }),
    methods: {
        async getData() {
            if (!this.cleaned) {
                const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');  
                const carsData = await carsDataReq.json();  
                this.cleaned = carsData.map(car => ({
                    mpg: car.Miles_per_Gallon,
                    horsepower: car.Horsepower,
                })).filter(car => car.mpg != null && car.horsepower != null);
            }
            console.log(this.detail);
        },
        toggleDetail() {
            this.detail = !this.detail;
        },
        async run() {
            if (this.cleaned) {
                const values = this.cleaned.map(d => ({
                    x: d.horsepower,
                    y: d.mpg,
                }));
                if (!this.plot) tfvis.render.scatterplot(
                    {name: 'Horsepower v MPG'},
                    {values}, 
                    {
                        xLabel: 'Horsepower',
                        yLabel: 'MPG',
                        height: 300
                    }
                )
                this.plot = true;
                tfvis.visor().open();
            }
        },
        createModel() {
            // Create a sequential model
            this.model = tf.sequential(); 
            
            // Add a single input layer
            this.model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
            
            this.model.add(tf.layers.dense({units: 24, activation: 'sigmoid'}));
            this.model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
            this.model.add(tf.layers.dense({units: 24, activation: 'sigmoid'}));

            // Add an output layer
            this.model.add(tf.layers.dense({units: 1, useBias: true}));

            tfvis.show.modelSummary({name: 'Model Summary'}, this.model);
            tfvis.visor().open();
            return this.model;
        },
        convertToTensor(data) {
            // Wrapping these calculations in a tidy will dispose any 
            // intermediate tensors.
            
            return tf.tidy(() => {
                // Step 1. Shuffle the data    
                tf.util.shuffle(data);

                // Step 2. Convert data to Tensor
                const inputs = data.map(d => d.horsepower)
                const labels = data.map(d => d.mpg);

                const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
                const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

                //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
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
        },
        async trainModel(model, inputs, labels) {
            // Prepare the model for training.  
            model.compile({
                optimizer: tf.train.adam(),
                loss: tf.losses.meanSquaredError,
                metrics: ['mse'],
            });
            
            const batchSize = 32;
            const epochs = 500;
            
            this.training = true;
            const train = await model.fit(inputs, labels, {
                batchSize,
                epochs,
                shuffle: true,
                yieldEvery: "epoch",
                callbacks: tfvis.show.fitCallbacks(
                    { name: 'Training Performance' },
                    ['loss', 'mse'], 
                    { height: 200, callbacks: ['onEpochEnd'] }
                )
            });
            this.training = false;
            return train;
        },
        async train() {
            if (this.cleaned && this.model) {
                tfvis.visor().open();
                // Convert the data to a form we can use for training.
                this.tensorData = this.convertToTensor(this.cleaned);
                const {inputs, labels} = this.tensorData;
                    
                // Train the model  
                await this.trainModel(this.model, inputs, labels);
                this.trained = true;
            }
        },
        testModel(model, inputData, normalizationData) {
            const {inputMax, inputMin, labelMin, labelMax} = normalizationData;  
            
            // Generate predictions for a uniform range of numbers between 0 and 1;
            // We un-normalize the data by doing the inverse of the min-max scaling 
            // that we did earlier.
            const [xs, preds] = tf.tidy(() => {
                
                const xs = tf.linspace(0, 1, 100);      
                const preds = model.predict(xs.reshape([100, 1]));      
                
                const unNormXs = xs
                    .mul(inputMax.sub(inputMin))
                    .add(inputMin);
                
                const unNormPreds = preds
                    .mul(labelMax.sub(labelMin))
                    .add(labelMin);
                
                // Un-normalize the data
                return [unNormXs.dataSync(), unNormPreds.dataSync()];
            });
            
            
            const predictedPoints = Array.from(xs).map((val, i) => {
                return {x: val, y: preds[i]}
            });
            
            const originalPoints = inputData.map(d => ({
                x: d.horsepower, y: d.mpg,
            }));
            
            tfvis.render.scatterplot(
                {name: 'Model Predictions vs Original Data'}, 
                {values: [originalPoints, predictedPoints], series: ['original', 'predicted']}, 
                {
                    xLabel: 'Horsepower',
                    yLabel: 'MPG',
                    height: 300
                }
            );
        },
        test() {
            if (this.model && this.cleaned && this.tensorData) this.testModel(this.model, this.cleaned, this.tensorData);
        }
    },
}
</script>

<style scoped>
</style>